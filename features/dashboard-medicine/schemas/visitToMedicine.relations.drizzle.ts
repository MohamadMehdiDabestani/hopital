import { medicines } from "@/features/dashboard-medicine/schemas/medicine.drizzle";
import { medicineCharges } from "@/features/dashboard-medicine/schemas/charges.drizzle";
import { relations } from "drizzle-orm";
import { visits } from "@/features/dasboard-admision/schemas/visits.drizzle";
import { users } from "@/features/auth/schemas/users.drizzle";

export const visitRelations = relations(visits, ({ many, one }) => ({
  medicines: many(medicines),
  charges: many(medicineCharges),
  doctor: one(users, {
    fields: [visits.doctorId],
    references: [users.id],
  }),
}));

export const medicineRelations = relations(medicines, ({ many }) => ({
  visits: many(visits),
}));

export const chargeRelations = relations(medicineCharges, ({ many }) => ({
  visits: many(visits),
}));
