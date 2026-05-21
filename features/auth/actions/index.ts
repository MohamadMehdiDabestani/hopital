"use server";
import {
  loginSchema,
  LoginSchemaType,
} from "@/features/auth/schemas/auth.schema";
import { ActionResult, signAccessToken } from "@/features/core";
import {
  changePasswordQuery,
  GetUserbyPhoneAndPass,
  updateLastLoginAfterLogin,
} from "@/features/auth/queries/users.queries";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ChangePasswordInput,
  changePasswordSchema,
} from "../schemas/changePassword.schema";
import { getUser } from "../utils/dal";
import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";
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
    await updateLastLoginAfterLogin(user.data.id);
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

export const changePasswordAction = async (
  data: ChangePasswordInput,
): Promise<ActionResult<undefined>> => {
  const parsedData = changePasswordSchema.safeParse(data);
  if (!parsedData.success) return { ok: false, message: "اطلاعات ناقض است" };
  try {
    const user = await getUser();
    if (!user) return { ok: false, message: "اطلاعات ناقض است" };
    const res = await changePasswordQuery(data, user.userId);
    return res;
  } catch (error: any) {
    return { ok: false, message: ActionErrorMapping(error) };
  }
};
