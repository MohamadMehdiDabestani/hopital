// db/seed.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/features/core/schema/schema.drizzle";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Create connection
  const sql = postgres(
    "postgresql://postgres:fCsJnOW76n9PYHbfergo@remote-pishgaman.runflare.com:30469/databaseufl_db",
    { prepare: false },
  );
  const db = drizzle(sql, { schema });
  const hashedPassword = await bcrypt.hash("123456789", 12);
  const userId = await db
    .insert(schema.users)
    .values({
      codeMeli: "4480172564",
      firstName: "محمد مهدی",
      lastName: "دبستانی",
      hashedPassword,
      phoneNumber: "09135377502",
      rule: "manager",
    })
    .returning({
      userId: schema.users.id,
    });
  await db.insert(schema.sites).values({
    createdByUserId: userId[0].userId,
    name: "بیمارستان امام حسین",
  });

  // --- Optional: Clear existing data (be careful!) ---
  // await db.delete(schema.users);
  // await db.delete(schema.posts);

  // --- Insert seed data ---
  // await db.insert(schema.users).values({
  //   lastName: "Reza",
  //   firstName: "Ali",
  //   codeMeli: "5569235741",
  //   phoneNumber: "09115699104",
  //   rule: "manager",
  //   hashedPassword,
  // });

  console.log("🎉 Seeding complete!");

  // Clean up connection
  await sql.end();
}

main().catch((err) => {
  console.error("❌ Seeding failed!", err);
  process.exit(1);
});

// runflare users:
// manager :
// phone : 09135377502 - pass : 123456789
// doctor:
// phone : 09135377505 - pass : 4480172566
// local user:
// manager :
// phone : phone : 0913537705 - 5569235741
