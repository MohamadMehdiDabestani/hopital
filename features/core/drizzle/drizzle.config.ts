import type { Config } from "drizzle-kit";

export default {
  schema: "./features/core/schema/schema.drizzle.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
   migrations: {
    schema: 'public', // Use public schema instead of drizzle schema
    table: 'drizzle_migrations', // Custom table name
  },
} satisfies Config;
