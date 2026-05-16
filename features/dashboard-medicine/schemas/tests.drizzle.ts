import { sites } from "@/features/dashboard-root/schemas/sites.drizzle";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  suspended: boolean("suspended").default(false),
  siteId : integer("siteId").references(() => sites.id)
});
