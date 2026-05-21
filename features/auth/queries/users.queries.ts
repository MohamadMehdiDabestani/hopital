import { db } from "@/features/core/drizzle/client";
import { users } from "@/features/core/schema/schema.drizzle";
import { eq, and, sql } from "drizzle-orm";
import { LoginSchemaType } from "@/features/auth/schemas/auth.schema";
import bcrypt from "bcrypt";
import { ActionResult } from "@/features/core";
type GetUserbyPhoneAndPassType = {
  rule: string;
  id: number;
};
export const GetUserbyPhoneAndPass = async (
  user: LoginSchemaType,
): Promise<ActionResult<GetUserbyPhoneAndPassType>> => {
  const [u] = await db
    .select({
      id: users.id,
      rule: users.rule,
      hashedPassword: users.hashedPassword,
    })
    .from(users)
    .where(and(eq(users.phoneNumber, user.phone), eq(users.suspended, false)));
  if (!u) return { ok: false, message: "کاربری یافت نشد" };
  const compare = await bcrypt.compare(user.password, u.hashedPassword);
  if (!compare) return { ok: false, message: "کاربری یافت نشد" };
  return {
    ok: true,
    data: {
      ...u,
    },
  };
};

export const updateLastLoginAfterLogin = async (userId: number) => {
  await db
    .update(users)
    .set({
      lastLoginAt: new Date(),
    })
    .where(eq(users.id, userId));
};
