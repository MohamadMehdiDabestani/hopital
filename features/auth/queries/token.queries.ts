import { ActionResult, hashToken } from "@/features/core";
import { db } from "@/features/core/drizzle/client";
import { refreshTokens, users } from "@/features/core/schema/schema.drizzle";
import { eq } from "drizzle-orm";
export const SaveRefreshToken = async ({
  userId,
  exp,
  refresh,
}: {
  userId: number;
  refresh: string;
  exp: Date;
}): Promise<{ expiresAt: Date }> => {
  const [record] = await db
    .insert(refreshTokens)
    .values({
      userId: userId,
      tokenHash: hashToken(refresh),
      expiresAt: exp,
    })
    .returning({ expiresAt: refreshTokens.expiresAt });
  return record;
};

export const GetRefreshToken = async (
  refresh: string,
): Promise<ActionResult<{ role: string; tokenHash: string }>> => {
  const [data] = await db

    .select({ tokenHash: refreshTokens.tokenHash, role: users.rule })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))

    .where(eq(refreshTokens.tokenHash, refresh))
    .limit(1);

  if (!data) return { ok: false, message: "توکن پیدا نشد" };

  return { ok: true, data };
};
export const UpdateRefreshToken = async ({
  newRefresh,
  refresh,
}: {
  newRefresh: string;
  refresh: string;
}) => {
  const [exp] = await db
    .update(refreshTokens)
    .set({ tokenHash: hashToken(newRefresh) })
    .where(eq(refreshTokens.tokenHash, refresh))
    .returning({ expiresAt: refreshTokens.expiresAt });
  return exp;
};
