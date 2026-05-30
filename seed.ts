// db/seed.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/features/core/schema/schema.drizzle';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🌱 Seeding database...');

  // Create connection
  const sql = postgres("postgresql://postgres:guHqLyL5bMHX78nSlsnj@remote-pishgaman.runflare.com:30507/hopitaldxlm_db", { prepare: false });
  const db = drizzle(sql, { schema });

  // --- Optional: Clear existing data (be careful!) ---
  // await db.delete(schema.users);
  // await db.delete(schema.posts);

  // --- Insert seed data ---
  const hashedPassword = await bcrypt.hash("123456789", 12)
  console.log('🔐 Hashed password:', hashedPassword)
  const compare = await bcrypt.compare("123456789", hashedPassword);
  console.log('✅ Password comparison result:', compare)
  // const [site] = await db.insert(schema.sites).values({
  //   name: "بیمارستان خاتمی",
  //   createdByUserId: 2
  // }).returning({ siteId: schema.sites.id })
  // await db.update(schema.users).set({ siteId: site.siteId }).where(eq(schema.users.phoneNumber, "09125477412"))
  await db.insert(schema.users).values({
    codeMeli : "6650332512",
    firstName : "زهرا",
    hashedPassword,
    lastName : "قاسمی",
    phoneNumber : "09126668711",
    rule : "doctor",
    siteId : 1,

  })
  console.log('🎉 Seeding complete!');

  // Clean up connection
  await sql.end();
}

main().catch((err) => {
  console.error('❌ Seeding failed!', err);
  process.exit(1);
});