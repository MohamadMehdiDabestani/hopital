import "server-only";
import { db } from "@/features/core/drizzle/client";
import { DasboardAdmisionSchemaType } from "@/features/dasboard-admision/schemas/dasboard-admision.schema";
import { people, visits } from "@/features/core/schema/schema.drizzle";
import { and, eq, sql } from "drizzle-orm";
import { ActionResult } from "@/features/core";

export const createVisitQuery = async (
  data: DasboardAdmisionSchemaType,
  siteId: number,
): Promise<ActionResult<undefined>> => {
  return await db.transaction(async (tx) => {
    const [row] = await tx
      .select({
        personId: people.id,
        visitId: visits.id, // اگر null بود یعنی ویزیت فعال ندارد
      })
      .from(people)
      .leftJoin(
        visits,
        and(eq(visits.personId, people.id), eq(visits.status, "waiting")),
      )
      .where(eq(people.codeMeli, data.codeMeli))
      .limit(1);

    if (!row) return { ok: false, message: "شخصی وجود ندارد" };

    if (row.visitId) return { ok: false, message: "ویزیت فعال دارد" };
    
    const [queue] = await tx
      .select({ count: sql<number>`count(*)` })
      .from(visits)
      .where(
        and(
          eq(visits.siteId, siteId),
          eq(visits.doctorId, data.doctorId),
          eq(visits.status, "waiting"),
        ),
      );
    const status = queue.count === 0 ? "treat" : "waiting";

    await tx.insert(visits).values({
      personId: row.personId,
      status,
      siteId,
      doctorId: data.doctorId,
    });
    return { ok: true, data: undefined };
  });
};
