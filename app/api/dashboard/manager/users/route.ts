import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import { sites, users } from "@/features/core/schema/schema.drizzle";
import { and, eq, sql } from "drizzle-orm";
import {
  parseGridParams,
  buildWhere,
  buildOrderBy,
} from "@/features/core/utils/filterDatagrid";
import { getUser } from "@/features/auth/utils/dal";

const columnMap = {
  id: users.id,
  firstName: users.firstName,
  lastName: users.lastName,
  codeMeli: users.codeMeli,
  phone: users.phoneNumber,
  status: users.suspended,
  lastLoginAt: users.lastLoginAt,
  role: users.rule,
};

export async function GET(req: NextRequest) {
  try {
    const { page, pageSize, sortModel, filterModel } = parseGridParams(req.url);
    const currentUser = await getUser();
    const where = buildWhere(columnMap, filterModel, [
      users.firstName,
      users.lastName,
      users.codeMeli,
      users.phoneNumber,
      // users.lastLoginAt,
      users.rule,
    ]);

    const orderBy = buildOrderBy(columnMap, sortModel, users.id);

    const [rows, total] = await Promise.all([
      db
        .select({
          id : users.id,
          // createdByUserId: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          codeMeli: users.codeMeli,
          phone: users.phoneNumber,
          lastLoginAt: users.lastLoginAt,
          suspended: users.suspended,
          role : users.rule
        })
        .from(sites)
        .innerJoin(users, eq(users.siteId, sites.id))
        .where(and(eq(sites.createdByUserId, Number(currentUser?.userId)), where))
        .orderBy(orderBy)
        .limit(pageSize)
        .offset(page * pageSize),

      db
        .select({ count: sql<number>`count(*)` })
        .from(sites)
        .innerJoin(users, eq(users.siteId, sites.id))
        .where(and(eq(sites.createdByUserId, Number(currentUser?.userId)), where))
        .then((r) => r[0]?.count ?? 0),
    ]);

    return NextResponse.json({ ok: true, rows, total });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "مشکلی پیش آمده" });
  }
}
