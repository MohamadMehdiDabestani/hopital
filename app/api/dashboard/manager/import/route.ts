import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import { and, eq } from "drizzle-orm";
import { excelRowImportSchema } from "@/features/dashboard-manager/schemas/dashboard-managerImportExcel.schema";
import { users } from "@/features/auth/schemas/users.drizzle";
import { getUser } from "@/features/auth/utils/dal";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generatePassword } from "@/features/core/utils/passwordGenerator";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) redirect("/");
    const siteId = Number(user.siteId);

    const body = await req.json();
    const { rows } = body;

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
      if (!grouped.has(row.codeMeli)) {
        grouped.set(row.codeMeli, []);
      }
      grouped.get(row.codeMeli)!.push(row);
    }

    await db.transaction(async (tx) => {
      for (const [codeMeli, rows] of grouped.entries()) {
        const base = rows[0];

        const existing = await tx
          .select({
            id: users.id,
          })
          .from(users)
          .where(and(eq(users.codeMeli, codeMeli), eq(users.siteId, siteId)))
          .limit(1);

        if (!existing.length) {
          const password = generatePassword();
          const hashedPassword = await bcrypt.hash(password, 12);
          await tx
            .insert(users)
            .values({
              firstName: base.firstName,
              lastName: base.lastName,
              codeMeli: base.codeMeli,
              suspended: base.suspended,
              rule: base.role,
              hashedPassword: hashedPassword,
              phoneNumber: base.phoneNumber,
              siteId: siteId,
            })
            
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
