import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { people, sites, users } from "@/features/core/schema/schema.drizzle";
export const statusEnum = pgEnum("statusEnum", [
  "waiting",
  "treat",
  "doneVisit",
  "reciveMedicine",
  "finish",
  "suspended",
]);
export type Status = (typeof statusEnum.enumValues)[number];

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  personId: integer("personId")
    .notNull()
    .references(() => people.id),
  siteId: integer("siteId")
    .notNull()
    .references(() => sites.id),
  doctorId: integer("doctorId")
    .notNull()
    .references(() => users.id),
  status: statusEnum("status").notNull(),
  extraNotes: varchar("extraNotes", { length: 100 }),
  receptionTime: timestamp("receptionTime", { withTimezone: true })
    .defaultNow()
    .notNull(),
  treatTime: timestamp("treatTime", { withTimezone: true }),
  exitRoomAt: timestamp("exitRoomAt", { withTimezone: true }),
  reciveMedicineTime: timestamp("reciveMedicineTime", { withTimezone: true }),
});
