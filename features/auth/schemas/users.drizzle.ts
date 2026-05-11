import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { sites } from "@/features/core/schema/schema.drizzle";
export const roleEnum = pgEnum("role", [
  "root",
  "manager",
  "doctor",
  "medicine",
  "admision",
]);
export type Role = (typeof roleEnum.enumValues)[number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  createDate: timestamp("createDate", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastLoginAt: timestamp("lastLoginAt", { withTimezone: true }),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull().unique(),
  codeMeli: varchar("codeMeli", { length: 10 }).notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  hashedFirstTimePassword: text("hashedFirstTimePassword"),
  forcedChangePassword: boolean("forcedChangePassword").default(true).notNull(),
  rule: roleEnum("rule").notNull(),
  suspended: boolean("suspended").default(false).notNull(),
  siteId: integer("siteId").references((): AnyPgColumn => sites.id, {
    onDelete: "cascade",
  }),
});
