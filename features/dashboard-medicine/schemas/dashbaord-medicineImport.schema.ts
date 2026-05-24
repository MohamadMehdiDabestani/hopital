import { z } from "zod";
import { formEnum } from "./medicine.drizzle";
import { persianToEnglishForm } from "../const";
export type MedicineForm = (typeof formEnum.enumValues)[number];

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

export type ExcelRowImportValues = z.infer<typeof excelRowImportSchema>;
