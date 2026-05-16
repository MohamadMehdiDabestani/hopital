import { getUser } from "@/features/auth/utils/dal";
import { getTestQuery } from "@/features/dashboard-medicine/queries/tests.queries";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) redirect("/");

  const data = await getTestQuery(user.siteId as number);
  return NextResponse.json(data);
}
