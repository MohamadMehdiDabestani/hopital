import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const runMigrations = async () => {
  const connectionString = process.env.DATABASE_URL!;
  
  const migrationClient = postgres(connectionString, { max: 1 });
  
  await migrate(drizzle(migrationClient), {
    migrationsFolder: './drizzle',
  });

  await migrationClient.end();
  console.log('Migrations completed!');
};

runMigrations().catch(console.error);