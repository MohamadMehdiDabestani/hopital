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
import { getUser } from "@/features/auth/utils/dal";
import { revalidatePath } from "next/cache";

export const createOrUpdateUserForSite = async (
  data: DashboardManagerUserAddSchema,
): Promise<ActionResult<undefined>> => {
  const parsedData = dashboardManagerUserAddSchema.safeParse(data);
  if (!parsedData.success)
    return { ok: false, message: "اطلاعات را کامل وارد کنید" };
  try {
    const user = await getUser();
    await createOrUpdateUserForSiteQuery(parsedData.data, Number(user?.siteId));
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
  mode : string
): Promise<ActionResult<undefined>> => {
  try {
    await updateUserPasswordQuery(userId , mode);
    revalidatePath("/dashboard/manager");
    return { ok: true, data: undefined };
  } catch (error: any) {
    return { ok: false, message: ActionErrorMapping(error) };
  }
};
