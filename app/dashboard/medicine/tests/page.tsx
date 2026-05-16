import { getUser } from "@/features/auth/utils/dal";
import { DashboardTestsList } from "@/features/dashboard-medicine";
import { getTestQuery } from "@/features/dashboard-medicine/queries/tests.queries";

export default async function TestsPage() {
  const user = await getUser();

  const data = await getTestQuery(user?.siteId as number);
  return <DashboardTestsList initialData={data} />;
}
