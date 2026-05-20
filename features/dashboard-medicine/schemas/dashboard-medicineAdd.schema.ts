import { z } from "zod";
import dayjs from "@/features/core/utils/dayjs";
import { formEnum } from "./medicine.drizzle";
import { persianToEnglishForm } from "../const";
export type MedicineForm = (typeof formEnum.enumValues)[number];
export const medicineAddFormSchema = z.object({
  medicineId: z.number().optional(),
  name: z.string().min(2, "نام دارو حداقل ۲ کاراکتر"),
  form: z.enum(formEnum.enumValues, {
    error: () => ({
      message: "نوع دارو باید یکی از موارد: قرص، شربت، تزریقی، پماد باشد",
    }),
  }),
  isActive: z.boolean().default(true),
});

export const excelRowImportSchema = z.object({
  name: z.string().min(2, "نام دارو حداقل ۲ کاراکتر"),

  form: z
    .string()
    .transform((val) => persianToEnglishForm[val] || val) // ✅ تبدیل فارسی به انگلیسی
    .pipe(
      z.enum(formEnum.enumValues, {
        error: () => ({
          message: "نوع دارو باید یکی از موارد: قرص، شربت، تزریقی، پماد باشد",
        }),
      }),
    ),

  createdAt: z.string().optional(),

  isActive: z.boolean("مقدار وضعیت را تعیین کنید"),
  // chargeIsActive: isActiveSchema,

  chargeWarningDays: z.union([z.string(), z.number()]).optional(),

  chargeQuantity: z.union([z.string(), z.number()]).optional(),

  // در schema
  chargeCreateAt: z
    .union([z.number(), z.string(), z.date(), z.null(), z.undefined()])
    .transform((val) => {
      if (!val) return undefined;

      // تبدیل Excel serial number
      if (typeof val === "number") {
        return new Date((val - 25569) * 86400 * 1000).toISOString();
      }

      // نگه داشتن string برای پردازش بعدی
      if (typeof val === "string") {
        return val;
      }

      // تبدیل Date به ISO string
      if (val instanceof Date) {
        return val.toISOString();
      }

      return undefined;
    })
    .optional(),

  chargeExpiryDate: z
    .union([z.number(), z.string(), z.date(), z.null(), z.undefined()])
    .transform((val) => {
      if (!val) return undefined;

      // تبدیل Excel serial number
      if (typeof val === "number") {
        return new Date((val - 25569) * 86400 * 1000).toISOString();
      }

      // نگه داشتن string برای پردازش بعدی
      if (typeof val === "string") {
        return val;
      }

      // تبدیل Date به ISO string
      if (val instanceof Date) {
        return val.toISOString();
      }

      return undefined;
    })
    .optional(),

  chargeStorageLocation: z.string().optional().nullable(),

  chargeNotes: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),
});
export const excelUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "انتخاب فایل الزامی است" })
    .refine(
      (file) =>
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx"),
      {
        message: "فقط فایل Excel (.xlsx) مجاز است",
      },
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
    }),
});
export type ExcelUploadValues = z.infer<typeof excelUploadSchema>;
export type ExcelRowImportValues = z.infer<typeof excelRowImportSchema>;
export type MedicineAddFormValues = z.infer<typeof medicineAddFormSchema>;
