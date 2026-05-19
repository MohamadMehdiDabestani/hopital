import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db } from "@/features/core/drizzle/client";
import { and, eq, sql } from "drizzle-orm";
import { excelRowImportSchema } from "@/features/dashboard-medicine/schemas/dashboard-medicineAdd.schema";
import { medicines } from "@/features/dashboard-medicine/schemas/medicine.drizzle";
import { getUser } from "@/features/auth/utils/dal";
import { redirect } from "next/navigation";
import { medicineCharges } from "@/features/dashboard-medicine/schemas/charges.drizzle";
import dayjs from "@/features/core/utils/dayjs";

const HEADER_MAP: Record<string, string> = {
  "نام دارو": "name",
  فرم: "form",
  وضعیت: "isActive",
  "وضعیت شارژ": "chargeIsActive",
  "تاریخ ثبت": "createdAt",
  "تعداد شارژ": "chargeQuantity",
  "تاریخ انقضاشارژ": "chargeExpiryDate",
  "تاریخ ورود شارژ": "chargeCreateAt",
  "روزهای هشدار": "chargeWarningDays",
  "توضیحات اضافه شارژ": "chargeNotes",
  "محل نگهداری": "chargeStorageLocation",
};

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) redirect("/");
    const siteId = Number(user.siteId);
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "فایل ارسال نشده" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const validRows: any[] = [];
    const invalidRows: any[] = [];

    for (const [index, row] of (rawData as any[]).entries()) {
      const mappedData: any = {};
      Object.keys(row).forEach((key) => {
        const englishKey = HEADER_MAP[key.trim()];
        if (englishKey) {
          mappedData[englishKey] = row[key];
        }
      });
      const validation = excelRowImportSchema.safeParse(mappedData);

      if (!validation.success) {
        invalidRows.push({
          rowNumber: index + 2,
          errors: validation.error,
          data: row,
        });
      } else {
        validRows.push(validation.data);
      }
    }

    if (!validRows.length) {
      return NextResponse.json({
        message: "هیچ ردیف معتبری یافت نشد",
        invalidRows,
      });
    }

    const grouped = new Map<string, any[]>();

    for (const row of validRows) {
      if (!grouped.has(row.name)) grouped.set(row.name, []);
      grouped.get(row.name)?.push(row);
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
          const [inserted] = await tx
            .insert(medicines)
            .values({
              name: base.name,
              form: base.form,
              createdAt: base.createdAt
                ? dayjs(base.createdAt, { jalali: true }).toDate()
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

          const existingCharge = await tx
            .select({
              quantity: medicineCharges.quantity,
              id: medicineCharges.id,
            })
            .from(medicineCharges)
            .where(
              and(
                eq(medicineCharges.medicineId, medicineId),
                eq(medicineCharges.expiryDate, r.chargeExpiryDate ?? null),
                eq(medicineCharges.storageLocation, r.chargeStorageLocation),
              ),
            )
            .limit(1);
          const chargeData = {
            medicineId: medicineId,
            quantity: r.chargeQuantity,
            createdAt: r.chargeCreateAt ? r.chargeCreateAt : sql`now()`,

            expiryDate: r.chargeExpiryDate ?? sql`now() + interval '30 days'`,

            storageLocation: r.chargeStorageLocation ?? "وارد نشده",
            expiryAlertDays: r.chargeWarningDays ?? 10,

            suspended: r.chargeIsActive,
            notes: r.chargeNotes,
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
      invalidRows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
