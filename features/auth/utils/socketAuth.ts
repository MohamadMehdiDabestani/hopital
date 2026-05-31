import { verifyToken } from "../../core/utils";
import { db } from "../../core/drizzle/client";
import { users } from "../schemas/users.drizzle";
import { eq } from "drizzle-orm";
import { sites } from "../../dashboard-root/schemas/sites.drizzle";

export const getSocketUser = async (cookieString: string | undefined) => {
  if (!cookieString) return null;

  const tokenValue = cookieString
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1];

  if (!tokenValue) return null;

  try {
    const token = await verifyToken(tokenValue);
    if (!token.sub) return null;

    const userId = Number(token.sub);
    const [user] = await db
      .select({
        userId: users.id,
        siteId: users.siteId,
        role: users.rule,
      })
      .from(users)
      .leftJoin(sites, eq(users.siteId, sites.id))
      .where(eq(users.id, userId));

    return user || null;
  } catch (err) {
    return null;
  }
};
