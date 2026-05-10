import { NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import { visits, users, people } from "@/features/core/schema/schema.drizzle";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getUser } from "@/features/auth/utils/dal";

export async function GET() {
  const user = await getUser();
  const rows = await db
    .select({
      id: visits.id,
      fullName: sql<string>`concat(${people.firstName}, ' ', ${people.lastName})`,
      codeMeli: people.codeMeli,
      receptionTime: visits.receptionTime,
      treatTime: visits.treatTime,
      exitRoomAt: visits.exitRoomAt,
      status: visits.status,
      reciveMedicineTime: visits.reciveMedicineTime,
    })
    .from(visits)
    .where(eq(visits.siteId, user?.siteId as number))
    .innerJoin(people, eq(visits.personId, people.id))
    .orderBy(visits.receptionTime);

  return NextResponse.json({ rows });
}
