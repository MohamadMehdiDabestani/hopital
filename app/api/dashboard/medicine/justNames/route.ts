import { getUser } from "@/features/auth/utils/dal";
import { getMedicineListCache } from "@/features/dashboard-medicine/cache";
import { justMedicineNames } from "@/features/dashboard-medicine/queries/dashboard-medicine.queries";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) redirect("/");
  const data = await getMedicineListCache();
  const res = data?.map((m) => m.name);
  return NextResponse.json(res);
}
