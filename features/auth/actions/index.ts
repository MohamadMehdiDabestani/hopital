"use server";
import {
  loginSchema,
  LoginSchemaType,
} from "@/features/auth/schemas/auth.schema";
import {
  ActionResult,
  signAccessToken,
  signRefreshToken,
} from "@/features/core";
import { GetUserbyPhoneAndPass } from "@/features/auth/queries/users.queries";
import { SaveRefreshToken } from "@/features/auth/queries/token.queries";
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
    if (!user.ok) return user;
    const access = await signAccessToken({ sub: user.data.id, role : user.data.rule });
    const refresh = await signRefreshToken({ sub: user.data.id });
    const refreshExp = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await SaveRefreshToken({ refresh, userId: user.data.id, exp: refreshExp });
    const cookie = await cookies();
    cookie.set("access_token", access, {
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
    cookie.set("refresh_token", refresh, {
      httpOnly: true,
      path: "/",
      expires: refreshExp,
    });
    return { ok: true, data: null };
  } catch (err: any) {
    // const message = mapDbErrorToFa(err);
    // throw new Error("d") ;
    console.log(err);
    return { ok: false, message: "" };
  }
};
