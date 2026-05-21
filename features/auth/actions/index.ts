"use server";
import {
  loginSchema,
  LoginSchemaType,
} from "@/features/auth/schemas/auth.schema";
import { ActionResult, signAccessToken } from "@/features/core";
import { GetUserbyPhoneAndPass, updateLastLoginAfterLogin } from "@/features/auth/queries/users.queries";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
    const access = await signAccessToken({
      sub: String(user.data.id),
      role: user.data.rule,
    });
    const cookie = await cookies();
    cookie.set("access_token", access, {
      httpOnly: true,
      path: "/",
    });
    await updateLastLoginAfterLogin(user.data.id)
    return { ok: true, data: null };
  } catch (err: any) {
    return { ok: false, message: "کاربری یافت نشد" };
  }
};

export const logoutUser = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");

  redirect("/");
};
