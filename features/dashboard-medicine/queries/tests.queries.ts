import "server-only";

import { db } from "@/features/core/drizzle/client";
import { tests } from "@/features/dashboard-medicine/schemas/tests.drizzle";
import { eq } from "drizzle-orm";

export async function getTestQuery(siteId: number) {
  const res = await db.select().from(tests).where(eq(tests.siteId, siteId)).orderBy(tests.createdAt);
  return res;
}
export async function addTestQuery(data: {
  siteId: number;
  name: string;
  suspended: boolean;
}) {
  await db.insert(tests).values({
    name: data.name,
    suspended: data.suspended,
    siteId: data.siteId,
  });
}

export async function updateTestQuery(data: {
  siteId: number;
  id: number;
  name: string;
  suspended: boolean;
}) {
  await db
    .update(tests)
    .set({
      name: data.name,
      siteId: data.siteId,
      suspended: data.suspended,
    })
    .where(eq(tests.id, data.id));
}
