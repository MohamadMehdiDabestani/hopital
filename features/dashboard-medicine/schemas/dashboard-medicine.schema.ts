import { z } from 'zod';

export const dashboardMedicineSchema = z.object({
  // TODO: define fields
});

export type DashboardMedicineSchema = z.infer<typeof dashboardMedicineSchema>;
