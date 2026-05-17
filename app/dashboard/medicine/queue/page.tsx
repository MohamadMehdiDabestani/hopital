import { getUser } from "@/features/auth/utils/dal";
import { DashboardMedicineQueue } from "@/features/dashboard-medicine";
import { getMedicineQueueQuery } from "@/features/dashboard-medicine/queries/dashboard-medicine.queries";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await getUser()
    if(!user) redirect("/")
    const data = await getMedicineQueueQuery(user.siteId as number)
    return(<DashboardMedicineQueue  list={data} />)
}