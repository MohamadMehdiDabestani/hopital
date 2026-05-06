"use server";
import {
  loginSchema,
  LoginSchemaType,
} from "@/features/auth/schemas/auth.schema";
import { ActionResult, signAccessToken } from "@/features/core";
import { GetUserbyPhoneAndPass } from "@/features/auth/queries/users.queries";
import { cookies } from "next/headers";
export const loginUser = async (
  user: LoginSchemaType,
): Promise<ActionResult<null>> => {
  const parsed = loginSchema.safeParse(user);
  if (!parsed.success) {
    return { ok: false, message: "اطلاعات ورودی معتبر نیست." };
  }

  try {
    const user = await GetUserbyPhoneAndPass(parsed.data);
    if (!user.ok) return { ok: false, message: "کاربری یافت نشد" };
    const access = await signAccessToken({ sub: user.data.id });
    const cookie = await cookies();
    cookie.set("access_token", access, {
      httpOnly: true,
      path: "/",
    });
    return { ok: true, data: null };
  } catch (err: any) {
    return { ok: false, message: "کاربری یافت نشد" };
  }
};
