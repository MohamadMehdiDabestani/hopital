"use server";

import { ActionResult } from "@/features/core";
import {
  DashboardManagerUserAddSchema,
  dashboardManagerUserAddSchema,
} from "@/features/dashboard-manager/schemas/dashboard-manager.schema";
import {
  createOrUpdateUserForSiteQuery,
  updateUserPasswordQuery,
} from "@/features/dashboard-manager/queries/dashboard-manager.queries";
import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";
import { verifySession } from "@/features/auth/utils/dal";
import { revalidatePath } from "next/cache";
import { sendGetSMS } from "@/features/core/utils/sendSMS";

export const createOrUpdateUserForSite = async (
  data: DashboardManagerUserAddSchema,
): Promise<ActionResult<undefined>> => {
  const parsedData = dashboardManagerUserAddSchema.safeParse(data);
  if (!parsedData.success)
    return { ok: false, message: "اطلاعات را کامل وارد کنید" };
  try {
    const user = await verifySession();
    console.log(parsedData.data);
    await createOrUpdateUserForSiteQuery(parsedData.data, Number(user?.userId));
    return { ok: true, data: undefined };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? ActionErrorMapping(error as any),
    };
  }
};

export const resetUserPasswordAction = async (
  userId: number,
): Promise<ActionResult<undefined>> => {
  try {
    await updateUserPasswordQuery(userId);
    revalidatePath("/dashboard/manager");
    return { ok: true, data: undefined };
  } catch (error: any) {
    return { ok: false, message: ActionErrorMapping(error) };
  }
};
