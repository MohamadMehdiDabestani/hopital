import "server-only";

import { cookies } from "next/headers";
import { verifyToken } from "@/features/core";
import { db } from "@/features/core/drizzle/client";
import { users } from "@/features/auth/schemas/users.drizzle";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const verifySession = async () => {
  const cookie = (await cookies()).get("access_token")?.value;
  if (!cookie) return undefined;

  const token = await verifyToken(cookie);

  if (!token.sub) {
    return undefined;
  }
  return { isAuth: true, userId: token.sub, token: cookie };
};

const getUserCache = (key: string, userId: number) =>
  unstable_cache(async () => {
    const [user] = await db
      .select({
        userId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        siteId: users.siteId,
        role : users.rule
      })
      .from(users)
      .where(eq(users.id, userId));
    return user;
  }, [`user:${key}`])();
export const getUser = async () => {
  const token = await verifySession();
  if (!token) return undefined;
  return getUserCache(token.token, Number(token.userId));
};
