
import { db } from "@/features/core/drizzle/client";
import {DashboardTestsList} from "@/features/dashboard-medicine";
import { tests } from "@/features/dashboard-medicine/schemas/tests.drizzle";

export default async function TestsPage() {
  const data = await db.select().from(tests).orderBy(tests.id);
  return <DashboardTestsList initialData={data} />;
}
