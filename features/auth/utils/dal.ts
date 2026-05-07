import "server-only";

import { cookies } from "next/headers";
import { verifyToken } from "@/features/core";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/features/core";
import { users } from "@/features/auth/schemas/users.drizzle";
import { eq } from "drizzle-orm";
export const verifyCacheToken = cache(async () => {
  const cookie = (await cookies()).get("access_token")?.value;
  if (!cookie) redirect("/login");

  const token = await verifyToken(cookie);

  if (!token.sub) {
    redirect("/login");
  }
  return { isAuth: true, userId: token.sub };
});

export const getUser = cache(async () => {
  const token = await verifyCacheToken();
  if (!token) return null;

  try {
    const [user] = await db
      .select({
        userId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.id, Number(token.userId)));

    return user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
