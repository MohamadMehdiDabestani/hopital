import "server-only";

import { getUser } from "@/features/auth/utils/dal";
import { db } from "@/features/core/drizzle/client";
import { medicines } from "@/features/dashboard-medicine/schemas/medicine.drizzle";
import { and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { tests } from "@/features/dashboard-medicine/schemas/tests.drizzle";
const getCachedMedicineList = (siteId: number) =>
  unstable_cache(
    async () => {
      const data = await db
        .select({
          id: medicines.id,
          name: medicines.name,
          form: medicines.form,
          isActive: medicines.isActive,
        })
        .from(medicines)
        .where(and(eq(medicines.siteId, siteId), eq(medicines.isActive, true)))
        .orderBy(desc(medicines.createdAt));
      return data;
    },
    [`medicines-site-${siteId}`],
    {
      revalidate: 86400,
      tags: [`medicines-site-${siteId}`],
    },
  );
const getCachedTestList = (siteId: number) =>
  unstable_cache(
    async () => {
      const data = await db
        .select({
          id: tests.id,
          name: tests.name,
        })
        .from(tests)
        .where(and(eq(tests.siteId, siteId), eq(tests.suspended, false)))
        .orderBy(desc(tests.createdAt));
      return data;
    },
    [`test-site-${siteId}`],
    {
      revalidate: 86400,
      tags: [`test-site-${siteId}`],
    },
  );
export const getMedicineListCache = async () => {
  try {
    const user = await getUser();
    if (!user?.siteId) return undefined;

    const cachedFetch = getCachedMedicineList(user.siteId);
    const medicines = await cachedFetch();
    return medicines;
  } catch (error) {
    console.error("Failed to fetch medicines:", error);
    return undefined;
  }
};

export const getTestListCache = async () => {
  try {
    const user = await getUser();
    if (!user?.siteId) return undefined;

    const cachedFetch = getCachedTestList(user.siteId);
    const tests = await cachedFetch();
    return tests;
  } catch (error) {
    console.error("Failed to fetch tests:", error);
    return undefined;
  }
};
