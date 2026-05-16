import { medicines } from "@/features/dashboard-medicine/schemas/medicine.drizzle";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { recipe } from "./recipe.drizzle";
import { medicineCharges } from "@/features/dashboard-medicine/schemas/charges.drizzle";
import { relations } from "drizzle-orm";
import { visits } from "@/features/dasboard-admision/schemas/visits.drizzle";
import { users } from "@/features/auth/schemas/users.drizzle";

export const recipeToMedicine = pgTable("recipeToMedicine", {
  medicineId: integer("medicineId")
    .references(() => medicines.id)
    .notNull(),
  recipeId: integer("recipeId")
    .references(() => recipe.id)
    .notNull(),
  chargeId: integer("chargeId")
    .references(() => medicineCharges.id)
    .notNull(),
  intervalMeta: integer("intervalMeta"),
  daysPerWeekMeta: integer("daysPerWeekMeta"),
  noteMeta: varchar("noteMeta", { length: 150 }),
  count: integer("count"),
});

// --- relationes

export const recipeRelationes = relations(recipe, ({ many, one }) => ({
  medicines: many(medicines),
  charges: many(medicineCharges),
  visit: one(visits, {
    fields: [recipe.visitId],
    references: [visits.id],
  }),
  doctor: one(users , {
    fields : [recipe.doctorId],
    references : [users.id]
  }),
}));

export const medicineRelationes = relations(medicines, ({ many }) => ({
  recipes: many(recipe),
}));

export const chargeRelationes = relations(medicineCharges, ({ many }) => ({
  recipes: many(recipe),
}));
