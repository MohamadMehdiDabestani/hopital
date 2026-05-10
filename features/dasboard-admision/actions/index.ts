"use server";

import { ActionResult } from "@/features/core";
import {
  DasboardAdmisionSchemaType,
  dasboardAdmisionSchema,
} from "@/features/dasboard-admision/schemas/dasboard-admision.schema";
import { createVisitQuery } from "../queries/dasboard-admision.queries";
import { getUser } from "@/features/auth/utils/dal";
import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";

export const createVisitAction = async (
  data: DasboardAdmisionSchemaType,
): Promise<ActionResult<undefined>> => {
  const parsedData = dasboardAdmisionSchema.safeParse(data);
  if (!parsedData.success) return { ok: false, message: "اطلاعات ناقض میباشد" };
  try {
    const user = await getUser();
    if (!user) return { ok: false, message: "اطلاعات ناقض میباشد" };
    const res =  await createVisitQuery(parsedData.data, Number(user.siteId));
    return res;
  } catch (error: any) {
    console.log(error)
    return { ok: false, message: ActionErrorMapping(error) };
  }
};
