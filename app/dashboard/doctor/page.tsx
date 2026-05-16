import { DoctorPatient } from "@/features/dashboard-doctor";
import { getMedicineListCache } from "@/features/dashboard-doctor/cache";
import { redirect } from "next/navigation";

export default async function DasoboardAdmisionPage() {
  const medicineList = await getMedicineListCache();
  if(!medicineList) redirect("/")
  return <DoctorPatient medicineList={medicineList} />;
}
