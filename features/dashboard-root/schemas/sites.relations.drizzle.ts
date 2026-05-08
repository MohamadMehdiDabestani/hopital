import { relations } from "drizzle-orm";
import { sites, users } from "@/features/core/schema/schema.drizzle";

// sites relations
export const sitesRelations = relations(sites, ({ many, one }) => ({
  users: many(users),
  creator: one(users, {
    fields: [sites.createdByUserId],
    references: [users.id],
  }),
}));

// users relations
export const usersRelations = relations(users, ({ one }) => ({
  site: one(sites, {
    fields: [users.siteId],
    references: [sites.id],
  }),
}));
