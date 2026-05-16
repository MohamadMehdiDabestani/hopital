import * as z from "zod";

export const dashboardMedicineTestSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "نام آزمایش الزامی است"),
  suspended: z.boolean(),
});

export type DashboardMedicineTestSchema = z.infer<typeof dashboardMedicineTestSchema>;