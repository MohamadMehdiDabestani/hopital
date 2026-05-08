import {
  pgTable,
  serial,
  text,
  uuid,
  integer,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { users } from "@/features/auth/schemas/users.drizzle";
export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  name: text("firstName").notNull(),
  socketId: uuid().defaultRandom(),
  createdByUserId: integer("createByUserId")
    .notNull()
    .unique()
    .references(() :AnyPgColumn => users.id, { onDelete: "cascade" }),
});
