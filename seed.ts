// db/seed.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/features/core/schema/schema.drizzle';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');
  
  // Create connection
  const sql = postgres("postgresql://postgres:admin@localhost:5432/hospital", { prepare: false });
  const db = drizzle(sql, { schema });

  // --- Optional: Clear existing data (be careful!) ---
  // await db.delete(schema.users);
  // await db.delete(schema.posts);

  // --- Insert seed data ---
  const hashedPassword = await bcrypt.hash("123456789" , 12)
  await db.insert(schema.users).values({
    lastName : "Reza",
    firstName : "Ali",
    codeMeli : "5569235741",
    phoneNumber : "09115699104",
    rule : "manager",
    hashedPassword,
  })

  console.log('🎉 Seeding complete!');
  
  // Clean up connection
  await sql.end();
}

main().catch((err) => {
  console.error('❌ Seeding failed!', err);
  process.exit(1);
});


// runflare users:
// doctor : 
// phone : 09135377502 - pass : ASDFGHasdfgh123