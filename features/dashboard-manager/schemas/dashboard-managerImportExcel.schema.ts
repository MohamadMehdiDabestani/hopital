import { roleEnum } from "@/features/auth/schemas/users.drizzle";
import { z } from "zod";

export const excelRowImportSchema = z.object({
  firstName: z.string("1").min(1, "نام را وارد کنید"),
  lastName: z.string("2").min(1, "نام خانوادگی را وارد کنید"),
  phoneNumber: z
    .string("3")
    .regex(/^\d{11}$/, "شماره موبایل باید دقیقاً 11 رقم باشد"),
  codeMeli: z.string("4").regex(/^\d{10}$/, "کد ملی باید دقیقاً 10 رقم باشد"),
  suspended: z.boolean(),
  role: z.enum(
    roleEnum.enumValues,
    "نقش باید یکی از موارد: مدیر , دارودار , دکتر , پذیرش باشد",
  ),
});

export type ExcelRowImport = z.infer<typeof excelRowImportSchema>;
