import { z } from 'zod';

export const dashboardDoctorSchema = z.object({
  // TODO: define fields
});

export type DashboardDoctorSchema = z.infer<typeof dashboardDoctorSchema>;
