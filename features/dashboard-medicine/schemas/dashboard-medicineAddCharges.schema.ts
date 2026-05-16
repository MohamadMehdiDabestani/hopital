import { z } from "zod";

export const dashboardMedicineAddCharges = z.object({
  chargeId : z.number().optional(),
  medicineId: z.coerce.number().positive("باید عدد مثبت باشد"),

  quantity: z.coerce
    .number("عددی را وارد کنید")
    .positive("نمیتواند کمتر از یک باشد")
    .min(1, "نمیتواند کمتر از یک باشد"),

  expiryDate: z.string().min(1, "تاریخ انقضا الزامی است"),

  storageLocation: z
    .string({ error: "محل ذخیره‌سازی الزامی است" })
    .min(1, "محل ذخیره‌سازی الزامی است"),

  expiryAlertDays: z.coerce
    .number("عددی را وارد کنید")
    .min(1, "روز های هشدار الزامی است"),

  notes: z.string().max(1000, "حداکثر 1000 کاراکتر مجاز است").optional(),
});

export type DashboardMedicineAddCharges = z.infer<
  typeof dashboardMedicineAddCharges
>;
