import { DoctorPatient } from "@/features/dashboard-doctor";
import { getMedicineListCache, getTestListCache } from "@/features/dashboard-medicine/cache";
import { redirect } from "next/navigation";

export default async function DasoboardAdmisionPage() {
  const medicineList = await getMedicineListCache();
  const testList : any = await getTestListCache();
  if(!medicineList || !testList) redirect("/")
  return <DoctorPatient testList={testList} medicineList={medicineList} />;
}
