import "server-only";
import { db } from "@/features/core/drizzle/client";
import { DashboardRootSchema } from "@/features/dashboard-root/schemas/dashboard-root.schema";
import { sites } from "@/features/dashboard-root/schemas/sites.drizzle";
import { users } from "@/features/auth/schemas/users.drizzle";
import { generatePassword } from "@/features/core/utils/passwordGenerator";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
export const createNewSite = async (data: DashboardRootSchema) => {
  const password = generatePassword();
  return db.transaction(async (tx) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await tx
      .insert(users)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone,
        codeMeli: data.codeMeli,
        rule: "manager",
        hashedPassword,
      })
      .returning({ id: users.id });

    await tx.insert(sites).values({
      name: data.siteName,
      userId: newUser.id,
    });

    return { ok: true };
  });
};
export const updateSite = async (data: DashboardRootSchema) => {
  if (!data.siteId) throw new Error("siteId is required");

  await db.transaction(async (tx) => {
    // 1) گرفتن userId از سایت
    const [site] = await tx
      .select({ userId: sites.userId })
      .from(sites)
      .where(eq(sites.id, data.siteId as number))
      .limit(1);

    if (!site?.userId) throw new Error("User not found for this site");

    // 2) آپدیت سایت
    await tx
      .update(sites)
      .set({ name: data.siteName })
      .where(eq(sites.id, data.siteId as number));

    // 3) آپدیت کاربر مرتبط
    await tx
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        codeMeli: data.codeMeli,
        phoneNumber: data.phone,
        suspended: data.suspended,
      })
      .where(eq(users.id, site.userId));
  });
}
