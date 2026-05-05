import { db } from "@/features/core/drizzle/client";
import { users, refreshTokens } from "@/features/core/schema/schema.drizzle";
import { eq, and } from "drizzle-orm";
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
  const hashedPass = await bcrypt.hash(user.password, 12);
  const [u] = await db
    .select({
      id: users.id,
      rule: users.rule,
      hashedPassword: users.hashedPassword,
    })
    .from(users)
    .where(and(eq(users.phoneNumber, user.phone), eq(users.suspended, false)))
    .limit(1);
  if (!u) return { ok: false, message: "کاربری یافت نشد" };
  const compare = bcrypt.compare(hashedPass, u.hashedPassword);
  if (!compare) return { ok: false, message: "کاربری یافت نشد" };
  return {
    ok: true,
    data: {
      ...u,
    },
  };
};
