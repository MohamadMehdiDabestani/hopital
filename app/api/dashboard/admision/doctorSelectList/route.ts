import { NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import { users, visits } from "@/features/core/schema/schema.drizzle"; // مطابق اسکیمای خودت
import { and, eq, sql } from "drizzle-orm";
import { getUser } from "@/features/auth/utils/dal";

export async function GET() {
  const user = await getUser();
  const rows = await db
    .select({
      id: users.id,
      name: sql<string>`concat(${users.firstName}, ' ', ${users.lastName})`,
      queueCount: sql<number>`count(${visits.id})`,
    })
    .from(users)
    .where(
      and(eq(users.rule, "doctor"), eq(users.siteId, Number(user?.siteId))),
    )
    .leftJoin(
      visits,
      and(eq(visits.doctorId, users.id), eq(visits.status, "waiting")),
    )
    .groupBy(users.id, users.firstName, users.lastName);

  return NextResponse.json(rows);
}
