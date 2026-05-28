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
  console.log('🔐 Hashed password:', hashedPassword)
  const compare = await bcrypt.compare("123456789", hashedPassword);
  console.log('✅ Password comparison result:', compare)
  // await db.insert(schema.users).values({
  //   lastName : "DDDD",
  //   firstName : "DDDD",
  //   codeMeli : "666685124",
  //   phoneNumber : "09136666666",
  //   rule : "manager",
  //   hashedPassword,
  // })

  console.log('🎉 Seeding complete!');
  
  // Clean up connection
  await sql.end();
}

main().catch((err) => {
  console.error('❌ Seeding failed!', err);
  process.exit(1);
});