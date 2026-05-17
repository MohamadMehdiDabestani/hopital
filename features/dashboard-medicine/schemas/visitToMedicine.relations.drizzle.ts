import { medicines } from "@/features/dashboard-medicine/schemas/medicine.drizzle";
import { check, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { medicineCharges } from "@/features/dashboard-medicine/schemas/charges.drizzle";
import { relations, sql } from "drizzle-orm";
import { visits } from "@/features/dasboard-admision/schemas/visits.drizzle";
import { users } from "@/features/auth/schemas/users.drizzle";
import { tests } from "./tests.drizzle";

export const visitToMedicine = pgTable(
  "visitToMedicine",
  {
    medicineId: integer("medicineId").references(() => medicines.id),
    visitId: integer("visitId").references(() => visits.id),
    chargeId: integer("chargeId").references(() => medicineCharges.id),
    testId: integer("testId").references(() => tests.id),
    intervalMeta: integer("intervalMeta"),
    daysPerWeekMeta: integer("daysPerWeekMeta"),
    noteMeta: varchar("noteMeta", { length: 150 }),
    count: integer("count"),
  },
  (table) => [
    check(
      "medicineOrTest",
       sql`(
        (${table.medicineId} IS NOT NULL AND ${table.testId} IS NULL) OR
        (${table.medicineId} IS NULL AND ${table.testId} IS NOT NULL)
      )`
    ),
  ],
);

// --- relations

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

