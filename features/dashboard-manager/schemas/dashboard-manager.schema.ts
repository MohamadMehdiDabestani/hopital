import { z } from 'zod';

export const dashboardManagerSchema = z.object({
  // TODO: define fields
});

export type DashboardManagerSchema = z.infer<typeof dashboardManagerSchema>;
