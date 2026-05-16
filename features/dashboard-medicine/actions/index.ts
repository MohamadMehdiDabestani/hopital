"use server";

import { ActionResult } from "@/features/core";
import {
  medicineAddFormSchema,
  MedicineAddFormValues,
} from "../schemas/dashboard-medicineAdd.schema";
import {
  DashboardMedicineAddCharges,
  dashboardMedicineAddCharges,
} from "../schemas/dashboard-medicineAddCharges.schema";
import {
  DashboardMedicineTestSchema,
  dashboardMedicineTestSchema,
} from "../schemas/dashboard-medicineTests.schema";
import {
  addMedicineChargeQuery,
  addMedicineQuery,
  updateChargeMedicineQuery,
  updateMedicineQuery,
} from "../queries/dashboard-medicine.queries";

import { getUser } from "@/features/auth/utils/dal";
import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";
import { redirect } from "next/navigation";
import { addTestQuery, updateTestQuery } from "../queries/tests.queries";

export const addOrUpdateMedicineAction = async (
  data: MedicineAddFormValues,
): Promise<ActionResult<undefined>> => {
  const parsedData = medicineAddFormSchema.safeParse(data);
  if (!parsedData.success)
    return { ok: false, message: "اطلاعات وارد شده اشتباه است" };
  try {
    const user = await getUser();
    if (!user) return { ok: false, message: "مشکلی پیش آمده" };
    const siteId = Number(user?.siteId);
    if (!parsedData.data.medicineId)
      await addMedicineQuery(parsedData.data, siteId);
    else {
      const res = await updateMedicineQuery(parsedData.data, siteId);
      return res;
    }
    return { ok: true, data: undefined };
  } catch (error: any) {
    return { ok: false, message: ActionErrorMapping(error) };
  }
};
export const addOrUpdateMedicineChargeAction = async (
  data: DashboardMedicineAddCharges,
): Promise<ActionResult<undefined>> => {
  const parsedData = dashboardMedicineAddCharges.safeParse(data);
  if (!parsedData.success)
    return { ok: false, message: "اطلاعات وارد شده اشتباه است" };
  try {
    if (parsedData.data.chargeId)
      await updateChargeMedicineQuery(parsedData.data);
    else await addMedicineChargeQuery(parsedData.data);
    return { ok: true, data: undefined };
  } catch (error: any) {
    return { ok: false, message: ActionErrorMapping(error) };
  }
};
export const addOrUpdateMedicineTestAction = async (
  data: DashboardMedicineTestSchema,
): Promise<ActionResult<undefined>> => {
  const parsedData = dashboardMedicineTestSchema.safeParse(data);
  if (!parsedData.success)
    return { ok: false, message: "اطلاعات وارد شده ناقص میباشد" };

  try {
    const user = await getUser();
    if (!user) redirect("/");
    if (parsedData.data.id === undefined) {
      await addTestQuery({ siteId: user.siteId as number, ...parsedData.data });
    } else {
      await updateTestQuery({
        id: parsedData.data.id,
        siteId: user.siteId as number,
        ...parsedData.data,
      });
    }

    return { ok: true, data: undefined };
  } catch (error: any) {
    return { ok: false, message: ActionErrorMapping(error) };
  }
};
