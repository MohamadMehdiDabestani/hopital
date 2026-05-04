"use server";
import {
  loginSchema,
  LoginSchemaType,
} from "@/features/auth/schemas/auth.schema";
import { ActionResult } from "@/features/core";
export const loginUser = async (
  user: LoginSchemaType,
): Promise<ActionResult<null>> => {
  const parsed = loginSchema.safeParse(user);
  if (!parsed.success) {
    return { ok: false, message: "اطلاعات ورودی معتبر نیست." };
  }

  try {
    return { ok: true, data: null };
  } catch (err: any) {
    // const message = mapDbErrorToFa(err);
    // throw new Error("d") ;
    console.log(err);
    return { ok: false, message: "" };
  }
};
