import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import { users, sites } from "@/features/core/schema/schema.drizzle";
import { eq, sql } from "drizzle-orm";
import { parseGridParams, buildWhere, buildOrderBy } from "@/features/core/utils/filterDatagrid"

const columnMap = {
  id: sites.id,
  siteName: sites.name,
  firstName: users.firstName,
  lastName: users.lastName,
  codeMeli: users.codeMeli,
  phone: users.phoneNumber,
  status: users.suspended,
  lastLoginAt: users.lastLoginAt,
};

export async function GET(req: NextRequest) {
  const { page, pageSize, sortModel, filterModel } = parseGridParams(req.url);

  const where = buildWhere(
    columnMap,
    filterModel,
    [
      users.firstName,
      users.lastName,
      users.codeMeli,
      users.phoneNumber,
      // users.suspended,
      sites.name,
      sql`CAST(${sites.id} AS TEXT)`,
    ],
  );

  const orderBy = buildOrderBy(columnMap, sortModel, sites.id);

  const [rows, total] = await Promise.all([
    db
      .select({
        id: sites.id,
        siteName: sites.name,
        user: {
          userId: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          codeMeli: users.codeMeli,
          phone: users.phoneNumber,
          lastLoginAt: users.lastLoginAt,
          suspended: users.suspended,
        },
      })
      .from(sites)
      .leftJoin(users, eq(sites.userId, users.id))
      .where(where)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(page * pageSize),

    db
      .select({ count: sql<number>`count(*)` })
      .from(sites)
      .leftJoin(users, eq(sites.userId, users.id))
      .where(where)
      .then((r) => r[0]?.count ?? 0),
  ]);

  return NextResponse.json({ rows, total });
}
