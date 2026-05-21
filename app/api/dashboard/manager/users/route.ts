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
import { redirect } from "next/navigation";
import { getUserListQuery } from "@/features/dashboard-manager/queries/dashboard-manager.queries";

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
    const currentUser = await getUser();
    const { page, pageSize, sortModel, filterModel } = parseGridParams(req.url);
    const { rows, total } = await getUserListQuery({
      siteId: Number(currentUser?.siteId),
      page,
      pageSize,
      sortModel,
      filterModel,
    });

    return NextResponse.json({ ok: true, rows, total });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({
      ok: false,
      message: "مشکلی پیش آمده",
      error: String(error),
    });
  }
}
