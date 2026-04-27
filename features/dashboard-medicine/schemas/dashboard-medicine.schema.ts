"use client";
import { z } from "zod";

const numRequired = z.coerce.number().positive();

export const dashboardMedicineSchema = z.object({
  visitId: numRequired,
  medicines: z.array(
    z.object({
      medicineId: numRequired,
      chargeId: numRequired,
      count: z.coerce.number().positive(),
    })
  ),
});

export type DashboardMedicineSchema = z.infer<typeof dashboardMedicineSchema>;