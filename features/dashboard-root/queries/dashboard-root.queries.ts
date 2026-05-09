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

    const [newSite] = await tx
      .insert(sites)
      .values({
        name: data.siteName,
        createdByUserId: newUser.id,
      })
      .returning({ id: sites.id });
    await tx
      .update(users)
      .set({ siteId: newSite.id })
      .where(eq(users.id, newUser.id));
    return { ok: true };
  });
};
export const updateSite = async (data: DashboardRootSchema) => {
  if (!data.siteId) throw new Error("اطلاعات ناقض است");

  await db.transaction(async (tx) => {
    const [site] = await tx
      .select({ createdByUserId: sites.createdByUserId })
      .from(sites)
      .where(eq(sites.id, data.siteId as number))
      .limit(1);

    if (!site?.createdByUserId) throw new Error("کاربری یافت نشد");

    await tx
      .update(sites)
      .set({ name: data.siteName })
      .where(eq(sites.id, data.siteId as number));

    await tx
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        codeMeli: data.codeMeli,
        phoneNumber: data.phone,
        suspended: data.suspended,
      })
      .where(eq(users.id, site.createdByUserId));
  });
};
