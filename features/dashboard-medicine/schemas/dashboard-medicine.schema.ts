import { z } from "zod";

const numRequired = z.coerce.number().positive();

export const dashboardMedicineSchema = z.object({
  visitId: numRequired,
  medicines: z.array(
    z
      .object({
        medicineId: numRequired,
        chargeId: numRequired,
        count: z.coerce
          .number("عددی را وارد کنید")
          .positive("نمیتواند کمتر از یک باشد")
          .min(1, "نمیتواند کمتر از یک باشد"),
        quantity: z.number(),
      })
      .superRefine((val, ctx) => {
        if (val.count > val.quantity) {
          ctx.addIssue({
            code: "custom",
            message: "تعداد بیشتر از موجودی شارژ است",
            path: ["count"],
          });
        }
      }),
  ),
});

export type DashboardMedicineSchema = z.infer<typeof dashboardMedicineSchema>;
