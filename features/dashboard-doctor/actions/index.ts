"use server";

import { getUser } from "@/features/auth/utils/dal";
import { redirect } from "next/navigation";
import {
  doneTreatQuery,
  getNextPatientQuery,
} from "@/features/dashboard-doctor/queries/dashboard-doctor.queries";
import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";
import { ActionResult } from "@/features/core";
import { VisitHistory } from "../type";
import {
  dashboardDoctorPatientSchema,
  DashboardDoctorPatientSchema,
} from "../schemas/dashboard-doctor.schema";

export const getNextPatientAction = async (): Promise<
  ActionResult<VisitHistory[]>
> => {
  try {
    const user = await getUser();
    if (!user) redirect("/");

    const data = await getNextPatientQuery(user.userId, user.siteId as number);
    return { ok: true, data: data };
  } catch (error: any) {
    console.log(error);
    return { ok: false, message: ActionErrorMapping(error) };
  }
};

export const doneTreatAction = async (
  data: DashboardDoctorPatientSchema,
): Promise<ActionResult<undefined>> => {
  const parsedData = dashboardDoctorPatientSchema.safeParse(data);
  if (!parsedData.success)
    return { ok: false, message: "مقادیر وارد شده ناقص میباشد" };
  try {
    await doneTreatQuery(data);
    return { ok: true, data: undefined };
  } catch (error: any) {
    return { ok: false, message: ActionErrorMapping(error) };
  }
};
