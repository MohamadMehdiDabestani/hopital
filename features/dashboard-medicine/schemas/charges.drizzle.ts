import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { medicines } from "./medicine.drizzle";

export const medicineCharges = pgTable("medicine_charges", {
  id: serial("id").primaryKey(),
  medicineId: integer("medicineId")
    .notNull()
    .references(() => medicines.id),
  expiryDate: date("expiryDate").notNull(),
  quantity: integer("quantity").notNull(),

  storageLocation: varchar("storageLocation", { length: 100 }),
  expiryAlertDays: integer("expiryAlertDays").default(30).notNull(),

  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
