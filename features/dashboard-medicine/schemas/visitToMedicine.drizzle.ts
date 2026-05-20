import { medicines } from "@/features/dashboard-medicine/schemas/medicine.drizzle";
import { check, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { medicineCharges } from "@/features/dashboard-medicine/schemas/charges.drizzle";
import { sql } from "drizzle-orm";
import { visits } from "@/features/dasboard-admision/schemas/visits.drizzle";
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