import { users } from "@/features/auth/schemas/users.drizzle";
import { visits } from "@/features/dasboard-admision/schemas/visits.drizzle";
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

export const recipe = pgTable("recipe", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctorId")
    .references(() => users.id)
    .notNull(),
  visitId: integer("visitId")
    .references(() => visits.id)
    .notNull(),
  suspended: boolean("suspended").default(false),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
