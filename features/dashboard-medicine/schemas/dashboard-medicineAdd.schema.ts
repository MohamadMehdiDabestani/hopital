import { z } from "zod";
import dayjs from "@/features/core/utils/dayjs";

export const medicineAddFormSchema = z.object({
  medicineId: z.number().optional(),
  name: z.string().min(2, "نام دارو حداقل ۲ کاراکتر"),
  form: z.string().optional(),
  isActive: z.boolean().default(true),
});

const isActiveSchema = z
  .string()
  .transform((val) => val.replace(/\s+/g, ""))
  .refine((val) => val === "فعال" || val === "غیرفعال", {
    message: 'فقط مقادیر "فعال" یا "غیرفعال" مجاز هستند',
  })
  .transform((val) => val === "فعال");
export const excelRowImportSchema = z.object({
  name: z.string().min(2, "نام دارو حداقل ۲ کاراکتر"),

  form: z.enum(["قرص", "شربت", "تزریقی", "پماد"], {
    error: () => ({
      message: "نوع دارو باید یکی از موارد: قرص، شربت، تزریقی، پماد باشد",
    }),
  }),

  createdAt: z.string().optional(),

  isActive: isActiveSchema,
  chargeIsActive: isActiveSchema,

  chargeWarningDays: z.union([z.string(), z.number()]).optional(),

  chargeQuantity: z.union([z.string(), z.number()]).optional(),

  chargeCreateAt: z
    .union([z.number(), z.string(), z.date(), z.null(), z.undefined()])
    .transform((val) => {
      if (!val) return null;

      if (typeof val === "number") {
        return new Date((val - 25569) * 86400 * 1000);
      }

      if (typeof val === "string") {
        return dayjs(val, { jalali: true }).toDate();
      }

      return val;
    })
    .pipe(z.date().nullable())
    .optional(),

  chargeExpiryDate: z
    .union([z.number(), z.string(), z.date()])
    .transform((val) => {
      if (typeof val === "number") {
        return new Date((val - 25569) * 86400 * 1000);
      }
      return new Date(val);
    })
    .optional()
    .nullable(),

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
