import "server-only";

import { db } from "@/features/core/drizzle/client";
import {
  Status,
  visits,
} from "@/features/dasboard-admision/schemas/visits.drizzle";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { people } from "@/features/dashboard-manager/schemas/people.drizzle";
import { VisitHistory } from "../type";
import { visitToMedicine } from "@/features/dashboard-medicine/schemas/visitToMedicine.drizzle";
import { DashboardDoctorPatientSchema } from "../schemas/dashboard-doctor.schema";

export const getNextPatientQuery = async (
  doctorId: number,
  siteId: number,
): Promise<VisitHistory[]> => {
  const data = await db.transaction(async (tx) => {
    const [currentTreat] = await tx
      .select({
        personId: visits.personId,
        siteId: visits.siteId,
        treatTime: visits.treatTime,
        visitId: visits.id,
      })
      .from(visits)
      .innerJoin(people, and(eq(people.id, visits.personId)))
      .where(
        and(
          eq(visits.doctorId, doctorId),
          eq(visits.siteId, siteId),
          eq(visits.status, "treat"),
        ),
      )
      .orderBy(asc(visits.treatTime))
      .limit(1);

    if (currentTreat) {
      const history = await tx
        .select({
          id: visits.id,
          siteId: visits.siteId,
          personId: visits.personId,
          doctorId: visits.doctorId,
          status: visits.status,
          extraNotes: visits.extraNotes,
          treatTime: sql<string>`${visits.receptionTime}::text`,
          firstName: people.firstName,
          lastName: people.lastName,
        })
        .from(visits)
        .innerJoin(people, and(eq(people.id, visits.personId)))
        .where(
          and(
            eq(visits.personId, currentTreat.personId),
            eq(visits.siteId, currentTreat.siteId),
          ),
        )
        .orderBy(desc(visits.receptionTime))
        .limit(10);
      if (!currentTreat.treatTime)
        await tx
          .update(visits)
          .set({ treatTime: sql`now()` })
          .where(eq(visits.id, currentTreat.visitId));
      return history;
    }

    const [current] = await tx
      .update(visits)
      .set({
        status: "treat",
        treatTime: sql`now()`,
      })
      .where(
        sql`
      ${visits.id} = (
        select ${visits.id}
        from ${visits}
        where ${visits.doctorId} = ${doctorId}
          and ${visits.siteId} = ${siteId}
          and ${visits.status} = 'waiting'
        order by ${visits.receptionTime} asc
        limit 1
      )
    `,
      )
      .returning({
        personId: visits.personId,
        siteId: visits.siteId,
      });

    if (!current) return [];

    const history = await tx
      .select({
        id: visits.id,
        siteId: visits.siteId,
        personId: visits.personId,
        doctorId: visits.doctorId,
        status: visits.status,
        extraNotes: visits.extraNotes,
        treatTime: sql<string>`${visits.receptionTime}::text`,
        firstName: people.firstName,
        lastName: people.lastName,
      })
      .from(visits)
      .innerJoin(people, and(eq(people.id, visits.personId)))
      .where(
        and(
          eq(visits.personId, current.personId),
          eq(visits.siteId, current.siteId),
        ),
      )
      .orderBy(desc(visits.receptionTime))
      .limit(10);

    return history;
  });

  return data;
};
export const doneTreatQuery = async (data: DashboardDoctorPatientSchema) => {
  await db.transaction(async (tx) => {
    const { visitId, extraNotes, medicines, tests } = data;

    let status: Status = "finish";

    if (tests?.length) {
      const testList = tests.map((t) => ({
        testId: t.id,
        visitId,
      }));
      await tx.insert(visitToMedicine).values(testList);
      status = "finish";
    }
    if (medicines?.length) {
      const medicineList = medicines.map((m) => ({
        medicineId: m.id,
        visitId,
        intervalMeta: m.intervalHours,
        daysPerWeekMeta: m.daysPerWeek,
        noteMeta: m.note,
      }));
      await tx.insert(visitToMedicine).values(medicineList);
      status = "reciveMedicine";
    }

    await tx
      .update(visits)
      .set({
        exitRoomAt: sql`now()`,
        extraNotes,
        status,
      })
      .where(eq(visits.id, visitId));
  });
};
