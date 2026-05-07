import {
  pgTable,
  serial,
  text,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "@/features/auth/schemas/users.drizzle";
export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  name: text("firstName").notNull(),
  socketId: uuid().defaultRandom(),
  userId: integer("userId")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
});
