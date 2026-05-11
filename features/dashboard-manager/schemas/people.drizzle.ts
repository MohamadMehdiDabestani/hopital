import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull().unique(),
  codeMeli: varchar("codeMeli", { length: 10 }).notNull().unique(),
    
});
