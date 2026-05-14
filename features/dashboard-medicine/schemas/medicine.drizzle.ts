import { sites } from "@/features/dashboard-root/schemas/sites.drizzle";
import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  form: varchar("form", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  siteId: integer("siteId").references(() => sites.id),
});
