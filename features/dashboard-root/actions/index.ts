"use server";
import { ActionResult } from "@/features/core";
import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";
import {
  createNewSite,
  updateSite,
} from "@/features/dashboard-root/queries/dashboard-root.queries";
import {
  dashboardRootSchema,
  DashboardRootSchema,
} from "@/features/dashboard-root/schemas/dashboard-root.schema";
export const creatOrUpdateSiteAction = async (
  data: DashboardRootSchema,
): Promise<ActionResult<null>> => {
  const parsed = dashboardRootSchema.safeParse(data);
  if (!parsed.success)
    return { ok: false, message: "اطلاعات را کامل وارد کنید" };
  try {
    if (parsed.data.siteId) {
      await updateSite(parsed.data);
    } else {
      await createNewSite(parsed.data);
    }
    return { data: null, ok: true };
  } catch (error) {
    return { ok: false, message: ActionErrorMapping(error as any) };
  }
};
