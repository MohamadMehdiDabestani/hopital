import "server-only";

import { DashboardManagerUserAddSchema } from "@/features/dashboard-manager/schemas/dashboard-manager.schema";
import { db } from "@/features/core/drizzle/client";
import { users } from "@/features/auth/schemas/users.drizzle";
import { generatePassword } from "@/features/core/utils/passwordGenerator";
import bcrypt from "bcrypt";
import { sites } from "@/features/dashboard-root/schemas/sites.drizzle";
import { eq } from "drizzle-orm";

export const createOrUpdateUserForSiteQuery = async (
  data: DashboardManagerUserAddSchema,
  currentUserId: number,
) => {
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 12);
  return db.transaction(async (tx) => {
    if (!data.rowUserId) {
      const [site] = await tx
        .select({ siteId: sites.id })
        .from(sites)
        .where(eq(sites.createdByUserId, currentUserId));
      
      if (!site) throw new Error("کاربری یافت نشد");
      await tx.insert(users).values({
        firstName: data.firstName,
        codeMeli: data.codeMeli,
        suspended: false,
        lastName: data.lastName,
        phoneNumber: data.phone,
        rule: data.role,
        hashedPassword,
        siteId: site.siteId,
      });
    } else
      await tx
        .update(users)
        .set({
          firstName: data.firstName,
          codeMeli: data.codeMeli,
          suspended: data.suspended,
          lastName: data.lastName,
          phoneNumber: data.phone,
          rule: data.role,
        })
        .where(eq(users.id, data.rowUserId));
  });
};
