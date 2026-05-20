import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import { and, eq, sql } from "drizzle-orm";
import { excelRowImportSchema } from "@/features/dashboard-medicine/schemas/dashboard-medicineAdd.schema";
import { medicines } from "@/features/dashboard-medicine/schemas/medicine.drizzle";
import { getUser } from "@/features/auth/utils/dal";
import { redirect } from "next/navigation";
import { medicineCharges } from "@/features/dashboard-medicine/schemas/charges.drizzle";
import dayjs from "@/features/core/utils/dayjs";
import { z } from "zod";
import { parseDate } from "@/features/core";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) redirect("/");
    const siteId = Number(user.siteId);

    const body = await req.json();
    const { rows, isGregorian = false } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "داده‌های ورودی نامعتبر است" },
        { status: 400 },
      );
    }

    const validRows: z.infer<typeof excelRowImportSchema>[] = [];
    const invalidRows: Array<{ row: number; errors: string[] }> = [];

    rows.forEach((row, index) => {
      const parsed = excelRowImportSchema.safeParse(row);
      if (parsed.success) {
        validRows.push(parsed.data);
      } else {
        invalidRows.push({
          row: index + 1,
          errors: parsed.error.issues.map((e) => e.message),
        });
      }
    });

    if (validRows.length === 0) {
      return NextResponse.json(
        {
          error: "هیچ ردیف معتبری برای ایمپورت وجود ندارد",
          invalidRows,
        },
        { status: 400 },
      );
    }

    const grouped = new Map<string, typeof validRows>();
    for (const row of validRows) {
      if (!grouped.has(row.name)) {
        grouped.set(row.name, []);
      }
      grouped.get(row.name)!.push(row);
    }

    await db.transaction(async (tx) => {
      for (const [name, rows] of grouped.entries()) {
        const base = rows[0];
        
        const existing = await tx
          .select({
            id: medicines.id,
          })
          .from(medicines)
          .where(and(eq(medicines.name, name), eq(medicines.siteId, siteId)))
          .limit(1);

        let medicineId: number;

        if (existing.length) {
          medicineId = existing[0].id;
        } else {
          console.log("UPADTING" , base.form)
          const [inserted] = await tx
            .insert(medicines)
            .values({
              name: base.name,
              form: base.form,
              createdAt: base.createdAt
                ? parseDate(base.createdAt, isGregorian)
                : sql`now()`,
              isActive: base.isActive,
              siteId: siteId,
            })
            .returning({
              id: medicines.id,
            });
          medicineId = inserted.id;
        }

        for (const r of rows) {
          if (!r.chargeQuantity) continue;

          const expiryDate =
            parseDate(r.chargeExpiryDate, isGregorian) ??
            dayjs().add(30, "days").toDate();

          const existingCharge = await tx
            .select({
              quantity: medicineCharges.quantity,
              id: medicineCharges.id,
            })
            .from(medicineCharges)
            .where(
              and(
                eq(medicineCharges.medicineId, medicineId),
                eq(medicineCharges.expiryDate, expiryDate),
                eq(
                  medicineCharges.storageLocation,
                  r.chargeStorageLocation ?? "وارد نشده",
                ),
              ),
            )
            .limit(1);

          const chargeData = {
            medicineId,
            quantity: Number(r.chargeQuantity),
            createdAt: r.chargeCreateAt
              ? parseDate(r.chargeCreateAt, isGregorian)
              : sql`now()`,
            expiryDate: expiryDate,
            storageLocation: r.chargeStorageLocation ?? "وارد نشده",
            expiryAlertDays: Number(r.chargeWarningDays ?? 10),
            notes: r.chargeNotes ?? null,
          };

          if (existingCharge.length) {
            await tx
              .update(medicineCharges)
              .set(chargeData)
              .where(eq(medicineCharges.id, existingCharge[0].id));
          } else {
            await tx.insert(medicineCharges).values(chargeData);
          }
        }
      }
    });

    return NextResponse.json({
      message: "ایمپورت با موفقیت انجام شد",
      importedCount: validRows.length,
      invalidRows: invalidRows.length > 0 ? invalidRows : undefined,
    });
  } catch (err) {
    console.error("خطا در ایمپورت داروها:", err);
    return NextResponse.json(
      { error: "خطای سرور در هنگام ایمپورت" },
      { status: 500 },
    );
  }
}
