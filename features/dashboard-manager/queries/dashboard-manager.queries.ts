import "server-only";

import { DashboardManagerUserAddSchema } from "@/features/dashboard-manager/schemas/dashboard-manager.schema";
import { db } from "@/features/core/drizzle/client";
import { users } from "@/features/auth/schemas/users.drizzle";
import { generatePassword } from "@/features/core/utils/passwordGenerator";
import bcrypt from "bcryptjs";
import { sites } from "@/features/dashboard-root/schemas/sites.drizzle";
import { and, eq, sql } from "drizzle-orm";
import { buildOrderBy, buildWhere } from "@/features/core";
import { sendGetSMS } from "@/features/core/utils/sendSMS";

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

const quickSearchCols = [
  users.firstName,
  users.lastName,
  users.codeMeli,
  users.phoneNumber,
];
export const getUserListQuery = async ({
  siteId,
  page = 0,
  pageSize = 10,
  sortModel = [],
  filterModel = { items: [] },
}: {
  siteId: number;
  page?: number;
  pageSize?: number;
  sortModel?: Array<{ field: string; sort: "asc" | "desc" }>;
  filterModel?: { items: Array<any>; quickFilterValues?: string[] };
}) => {
  const where = buildWhere(columnMap, filterModel, quickSearchCols);
  const orderBy = buildOrderBy(columnMap, sortModel, users.id);
  const baseWhere = and(eq(users.siteId, siteId), where);

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        codeMeli: users.codeMeli,
        phone: users.phoneNumber,
        lastLoginAt: users.lastLoginAt,
        suspended: users.suspended,
        role: users.rule,
      })
      .from(users)
      .where(baseWhere)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(page * pageSize),

    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(baseWhere),
  ]);
  const total = Number(totalResult[0]?.count ?? 0);

  return { rows, total };
};
export const createOrUpdateUserForSiteQuery = async (
  data: DashboardManagerUserAddSchema,
  siteId: number,
) => {
  return db.transaction(async (tx) => {
    if (!data.rowUserId) {
      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 12);
      const [{ phoneNumber, fullName, siteName }] = await tx
        .insert(users)
        .values({
          firstName: data.firstName,
          codeMeli: data.codeMeli,
          suspended: false,
          lastName: data.lastName,
          phoneNumber: data.phone,
          rule: data.role,
          hashedPassword,
          siteId,
        })
        .returning({
          phoneNumber: users.phoneNumber,
          siteName: sites.name,
          fullName: sql<string>`concat(${users.firstName}, ' ', ${users.lastName})`,
        });
      await sendGetSMS(
        `آقا/خانم:${fullName} رمز عبور جدید شما: | ${password} | |${siteName}|`,
        phoneNumber,
      );
    } else
      await tx
        .update(users)
        .set({
          firstName: data.firstName,
          codeMeli: data.codeMeli,
          suspended: data.suspended,
          lastName: data.lastName,
          phoneNumber: data.phone,
          rule: data.role,
        })
        .where(eq(users.id, data.rowUserId));
  });
};
export const updateUserPasswordQuery = async (userId: number) => {
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 12);
  const [{ phoneNumber, fullName, siteName }] = await db
    .update(users)
    .set({
      hashedPassword: hashedPassword,
    })
    .where(eq(users.id, userId))
    .returning({
      phoneNumber: users.phoneNumber,
      siteName: sites.name,
      fullName: sql<string>`concat(${users.firstName}, ' ', ${users.lastName})`,
    });
  await sendGetSMS(
    `آقا/خانم:${fullName} رمز عبور جدید شما: | ${password} | |${siteName}|`,
    phoneNumber,
  );
};
