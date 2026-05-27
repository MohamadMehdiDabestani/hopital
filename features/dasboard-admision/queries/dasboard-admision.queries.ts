import "server-only";
import { db } from "@/features/core/drizzle/client";
import { DasboardAdmisionSchemaType } from "@/features/dasboard-admision/schemas/dasboard-admision.schema";
import {
  medicineCharges,
  medicines,
  people,
  Status,
  tests,
  users,
  visits,
  visitToMedicine,
} from "@/features/core/schema/schema.drizzle";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { ActionResult, buildOrderBy, buildWhere } from "@/features/core";
export const createVisitQuery = async (
  data: DasboardAdmisionSchemaType,
  siteId: number,
): Promise<ActionResult<undefined>> => {
  return await db.transaction(async (tx) => {
    // چک کردن وجود شخص
    const [personRow] = await tx
      .select({ id: people.id })
      .from(people)
      .where(eq(people.codeMeli, data.codeMeli))
      .limit(1);

    if (!personRow) return { ok: false, message: "شخصی وجود ندارد" };

    // چک کردن ویزیت فعال (تمام وضعیت‌های فعال)
    const activeStatuses: Status[] = ["waiting", "treat"];

    const [activeVisit] = await tx
      .select({ id: visits.id })
      .from(visits)
      .where(
        and(
          eq(visits.personId, personRow.id),
          inArray(visits.status, activeStatuses),
        ),
      )
      .limit(1);

    if (activeVisit) return { ok: false, message: "ویزیت فعال دارد" };

    // چک کردن آیا بیماری با وضعیت treat وجود داره
    const [hasTreat] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(visits)
      .where(
        and(
          eq(visits.siteId, siteId),
          eq(visits.doctorId, data.doctorId),
          eq(visits.status, "treat"),
        ),
      );

    // چک کردن آیا بیماری با وضعیت waiting وجود داره
    const [hasWaiting] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(visits)
      .where(
        and(
          eq(visits.siteId, siteId),
          eq(visits.doctorId, data.doctorId),
          eq(visits.status, "waiting"),
        ),
      );

    const treatCount = Number(hasTreat.count);
    const waitingCount = Number(hasWaiting.count);

    // اگر هیچ treat یا waiting وجود نداشت -> بیمار جدید treat می‌گیره
    // در غیر اینصورت waiting می‌گیره
    const status: Status =
      treatCount === 0 && waitingCount === 0 ? "treat" : "waiting";

    await tx.insert(visits).values({
      personId: personRow.id,
      status,
      siteId,
      doctorId: data.doctorId,
    });

    return { ok: true, data: undefined };
  });
};

const columnMap = {
  id: visits.id,
  firstName: people.firstName,
  lastName: people.lastName,
  codeMeli: people.codeMeli,
  doctorId: users.id,
  doctorFirstName: users.firstName,
  doctorLastName: users.lastName,
  status: visits.status,
  receptionTime: visits.receptionTime,
  treatTime: visits.treatTime,
  exitRoomAt: visits.exitRoomAt,
  reciveMedicineTime: visits.reciveMedicineTime,
  extraNotes: visits.extraNotes,
  medcineId: visitToMedicine.medicineId,
  medicineName: medicines.name,
  testId: visitToMedicine.testId,
  testName: tests.name,
  chargeId: visitToMedicine.chargeId,
  chargeLocation: medicineCharges.storageLocation,
  count: visitToMedicine.count,
};

const quickSearchCols = [
  people.firstName,
  people.lastName,
  people.codeMeli,
  users.firstName,
  users.lastName,
  medicines.name,
];

export const getAdmisionHistoryQuery = async ({
  siteId,
  page = 0,
  pageSize = 10,
  sortModel = [],
  filterModel = { items: [] },
  fromDateTime,
  toDateTime,
}: {
  siteId: number;
  page?: number;
  pageSize?: number;
  sortModel?: Array<{ field: string; sort: "asc" | "desc" }>;
  filterModel?: { items: Array<any>; quickFilterValues?: string[] };
  fromDateTime?: string;
  toDateTime?: string;
}) => {
  let additionalWhere = undefined;

  if (fromDateTime || toDateTime) {
    const dateConditions = [];

    if (fromDateTime) {
      dateConditions.push(gte(visits.receptionTime, new Date(fromDateTime)));
    }
    if (toDateTime) {
      console.log(toDateTime)
      dateConditions.push(lte(visits.receptionTime, new Date(toDateTime)));
    }

    additionalWhere = and(...dateConditions);
  }

  const where = buildWhere(columnMap, filterModel, quickSearchCols);
  const orderBy = buildOrderBy(columnMap, sortModel, users.id);

  // ترکیب where conditions
  const baseWhere = and(
    eq(visits.siteId, siteId),
    where,
    additionalWhere
  );

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: visits.id,
        firstName: people.firstName,
        lastName: people.lastName,
        codeMeli: people.codeMeli,
        doctorId: users.id,
        doctorFirstName: users.firstName,
        doctorLastName: users.lastName,
        status: visits.status,
        receptionTime: visits.receptionTime,
        treatTime: visits.treatTime,
        exitRoomAt: visits.exitRoomAt,
        reciveMedicineTime: visits.reciveMedicineTime,
        extraNotes: visits.extraNotes,
        medicines: sql<
          {
            id: number;
            name: string;
            chargeId: number | null;
            chargeLocation: string | null;
            count: number | null;
          }[]
        >`
          json_agg(
            DISTINCT jsonb_build_object(
              'id',            ${medicines.id},
              'name',          ${medicines.name},
              'chargeId',      ${visitToMedicine.chargeId},
              'chargeLocation',${medicineCharges.storageLocation},
              'count',         ${visitToMedicine.count}
            )
          ) FILTER (WHERE ${medicines.id} IS NOT NULL)
        `,
        tests: sql<{ id: number; name: string }[]>`
          json_agg(
            DISTINCT jsonb_build_object(
              'id',   ${tests.id},
              'name', ${tests.name}
            )
          ) FILTER (WHERE ${tests.id} IS NOT NULL)
        `,
      })
      .from(visits)
      .innerJoin(people, eq(visits.personId, people.id))
      .innerJoin(users, eq(visits.doctorId, users.id))
      .leftJoin(visitToMedicine, eq(visitToMedicine.visitId, visits.id))
      .leftJoin(medicines, eq(medicines.id, visitToMedicine.medicineId))
      .leftJoin(
        medicineCharges,
        eq(medicineCharges.id, visitToMedicine.chargeId),
      )
      .leftJoin(tests, eq(tests.id, visitToMedicine.testId))
      .where(baseWhere)
      .groupBy(
        visits.id,
        people.firstName,
        people.lastName,
        people.codeMeli,
        users.id,
        users.firstName,
        users.lastName,
      )
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(page * pageSize),

    db
      .select({ count: sql<number>`count(DISTINCT ${visits.id})` })
      .from(visits)
      .innerJoin(people, eq(visits.personId, people.id))
      .innerJoin(users, eq(visits.doctorId, users.id))
      .leftJoin(visitToMedicine, eq(visitToMedicine.visitId, visits.id))
      .leftJoin(medicines, eq(medicines.id, visitToMedicine.medicineId))
      .leftJoin(
        medicineCharges,
        eq(medicineCharges.id, visitToMedicine.chargeId),
      )
      .where(baseWhere),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  return { rows, total };
};


export const makeSuspendQuery = async (visitId: number) => {
  await db
    .update(visits)
    .set({
      status: "suspended",
    })
    .where(eq(visits.id, visitId));
};
