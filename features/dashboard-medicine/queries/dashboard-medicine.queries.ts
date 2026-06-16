import "server-only";
import { MedicineAddFormValues } from "../schemas/dashboard-medicineAdd.schema";
import { db } from "@/features/core/drizzle/client";
import { medicines } from "../schemas/medicine.drizzle";
import { and, eq, gt, gte, inArray, SQL, sql } from "drizzle-orm";
import { ActionResult, buildOrderBy, buildWhere } from "@/features/core";
import { DashboardMedicineAddCharges } from "../schemas/dashboard-medicineAddCharges.schema";
import { medicineCharges } from "../schemas/charges.drizzle";
import { visits } from "@/features/dasboard-admision/schemas/visits.drizzle";
import { people } from "@/features/dashboard-manager/schemas/people.drizzle";
import { visitToMedicine } from "../schemas/visitToMedicine.drizzle";
import { DashboardMedicineSchema } from "../schemas/dashboard-medicine.schema";
import { getUser } from "@/features/auth/utils/dal";

export const addMedicineQuery = async (
  data: MedicineAddFormValues,
  siteId: number,
) => {
  await db.insert(medicines).values({
    name: data.name,
    form: data.form,
    siteId,
  });
};

export const updateMedicineQuery = async (
  data: MedicineAddFormValues,
): Promise<ActionResult<undefined>> => {
  if (!data.medicineId) return { ok: false, message: "دارویی انتخاب نشده" };
  await db
    .update(medicines)
    .set({
      name: data.name,
      form: data.form,
      isActive: data.isActive,
    })
    .where(eq(medicines.id, data.medicineId));
  return { ok: true, data: undefined };
};
export const addMedicineChargeQuery = async (
  data: DashboardMedicineAddCharges,
) => {
  await db.insert(medicineCharges).values({
    expiryDate: new Date(data.expiryDate),
    medicineId: data.medicineId,
    quantity: data.quantity,
    expiryAlertDays: data.expiryAlertDays,
    storageLocation: data.storageLocation,
    notes: data.notes,
  });
};
export const updateChargeMedicineQuery = async (
  data: DashboardMedicineAddCharges,
) => {
  await db
    .update(medicineCharges)
    .set({
      expiryDate: new Date(data.expiryDate),
      quantity: data.quantity,
      expiryAlertDays: data.expiryAlertDays,
      storageLocation: data.storageLocation,
      notes: data.notes,
    })
    .where(eq(medicineCharges.id, data.chargeId as number));
};

export const getMedicineQueueQuery = async (siteId: number) => {
  const data = await db
    .select({
      id: visits.id,
      fullName: sql<string>`concat(${people.firstName}, ' ', ${people.lastName})`,
      codeMeli: people.codeMeli,
      receptionTime: sql<string>`${visits.receptionTime}::text`,
      treatTime: sql<string>`${visits.treatTime}::text`,
      exitRoomAt: sql<string>`${visits.exitRoomAt}::text`,
      status: visits.status,
    })
    .from(visits)
    .innerJoin(people, eq(people.id, visits.personId))
    .where(and(eq(visits.status, "reciveMedicine"), eq(visits.siteId, siteId)));
  return data;
};

export const updateVisitToMedicineQuery = async (
  data: DashboardMedicineSchema,
) => {
  await db.transaction(async (tx) => {
    await tx
      .update(visits)
      .set({
        status: "finish",
        reciveMedicineTime: sql`now()`,
      })
      .where(eq(visits.id, data.visitId));

    for (const med of data.medicines) {
      const res = await tx
        .update(medicineCharges)
        .set({
          quantity: sql`${medicineCharges.quantity} - ${med.count}`,
        })
        .where(
          and(
            eq(medicineCharges.id, med.chargeId),
            gte(medicineCharges.quantity, med.count),
          ),
        )
        .returning({ id: medicineCharges.id });

      if (res.length === 0) {
        throw new Error("موجودی دارو کافی نیست");
      }
      await tx
        .update(visitToMedicine)
        .set({
          chargeId: med.chargeId,
          count: med.count,
        })
        .where(
          and(
            eq(visitToMedicine.visitId, data.visitId),
            eq(visitToMedicine.medicineId, med.medicineId),
          ),
        );
    }
  });
};
export const getVisitMedicinesQuery = async (visitId: number) => {
  const rows = await db
    .select({
      medicineId: visitToMedicine.medicineId,
      medicineName: medicines.name,
      chargeId: medicineCharges.id,
      quantity: medicineCharges.quantity,
      expiryDate: medicineCharges.expiryDate,
      storageLocation: medicineCharges.storageLocation,
    })
    .from(visitToMedicine)
    .leftJoin(medicines, eq(visitToMedicine.medicineId, medicines.id))
    .leftJoin(
      medicineCharges,
      and(
        eq(medicineCharges.medicineId, medicines.id),
        eq(medicineCharges.suspended, false),
        gt(medicineCharges.expiryDate, sql`NOW()`),
      ),
    )
    .where(eq(visitToMedicine.visitId, visitId));

  // گروه‌بندی در کد
  const map = new Map<
    number,
    {
      medicineId: number;
      medicineName: string;
      charges: {
        chargeId: number;
        quantity: number;
        expiryDate: Date;
        storageLocation: string;
      }[];
    }
  >();

  for (const row of rows) {
    if (!map.has(row.medicineId!)) {
      map.set(row.medicineId!, {
        medicineId: row.medicineId!,
        medicineName: row.medicineName!,
        charges: [],
      });
    }
    if (row.chargeId) {
      map.get(row.medicineId!)!.charges.push({
        chargeId: row.chargeId,
        quantity: row.quantity!,
        expiryDate: row.expiryDate!,
        storageLocation: row.storageLocation!,
      });
    }
  }

  return [...map.values()];
};

const baseColumnMap = {
  id: medicines.id,
  name: medicines.name,
  form: medicines.form,
  createdAt: medicines.createdAt,
  siteId: medicines.siteId,
  isActive: medicines.isActive,
};

const fullColumnMap = {
  ...baseColumnMap,
  expiryDate: medicineCharges.expiryDate,
  quantity: medicineCharges.quantity,
  storageLocation: medicineCharges.storageLocation,
  expiryAlertDays: medicineCharges.expiryAlertDays,
  chargeCreateAt: medicineCharges.createdAt,
};

const chargeFields = new Set([
  "expiryDate",
  "quantity",
  "storageLocation",
  "expiryAlertDays",
  "chargeCreateAt",
]);

function needsChargeJoin(
  sortModel: any,
  filterModel: any,
  expiredOnly: boolean,
) {
  if (expiredOnly) return true;
  if (sortModel?.some((s: any) => chargeFields.has(s.field))) return true;
  if (filterModel?.items?.some((f: any) => chargeFields.has(f.field)))
    return true;
  if (filterModel?.quickFilterValues?.length) {
    return true;
  }
  return false;
}
function expireOnlyCondition(expireOnly: boolean) {
  return expireOnly
    ? sql`${medicines.id} = ${medicineCharges.medicineId}
          AND ${medicineCharges.expiryDate} IS NOT NULL
          AND ${medicineCharges.expiryAlertDays} IS NOT NULL
          AND (${medicineCharges.expiryDate}::DATE - CURRENT_DATE) <= ${medicineCharges.expiryAlertDays}`
    : sql`${medicines.id} = ${medicineCharges.medicineId}
          AND (${medicineCharges.expiryDate} IS NULL OR ${medicineCharges.expiryDate}::DATE >= CURRENT_DATE)`;
}
export const getMedicineListQuery = async ({
  page = 0,
  pageSize = 10,
  sortModel = [],
  filterModel = { items: [] },
  expiredOnly = false,
}: {
  page?: number;
  pageSize?: number;
  sortModel?: Array<{ field: string; sort: "asc" | "desc" }>;
  filterModel?: { items: Array<any>; quickFilterValues?: string[] };
  expiredOnly?: boolean;
}) => {
  const currentUser = await getUser();
  const userSiteId = Number(currentUser?.siteId);

  const joinCharges = needsChargeJoin(sortModel, filterModel, expiredOnly);
  const columnMap = joinCharges ? fullColumnMap : baseColumnMap;

  const searchFields = joinCharges
    ? [medicines.name, medicineCharges.storageLocation]
    : [medicines.name];

  const whereCondition = buildWhere(columnMap, filterModel, searchFields);
  const chargeCondition = expireOnlyCondition(expiredOnly);

  const baseConditions = [
    eq(medicines.siteId, userSiteId),
    whereCondition,
  ].filter((x): x is SQL => Boolean(x));

  const orderBy = buildOrderBy(columnMap, sortModel, medicines.id);

  // دریافت IDهای صفحه‌بندی شده
  let idsQuery = db
    .selectDistinct({ id: medicines.id })
    .from(medicines)
    .$dynamic();

  if (joinCharges) {
    if (expiredOnly) {
      idsQuery = idsQuery.innerJoin(medicineCharges, chargeCondition);
    } else {
      idsQuery = idsQuery.leftJoin(medicineCharges, chargeCondition);
    }
  }

  const idsResult = await idsQuery
    .where(and(...baseConditions))
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(page * pageSize);
  const idList = idsResult.map((x) => x.id);

  if (!idList.length) {
    // محاسبه تعداد کل
    let totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(medicines)
      .$dynamic();

    if (
      joinCharges &&
      (filterModel.items.length > 0 || filterModel.quickFilterValues?.length)
    ) {
      totalCountQuery = totalCountQuery.leftJoin(
        medicineCharges,
        eq(medicines.id, medicineCharges.medicineId),
      );
    }

    const totalCount = await totalCountQuery
      .where(and(...baseConditions))
      .then((r) => r[0]?.count ?? 0);

    return { rows: [], total: totalCount };
  }
  const flatRows = await db
    .select({
      id: medicines.id,
      name: medicines.name,
      form: medicines.form,
      createdAt: medicines.createdAt,
      siteId: medicines.siteId,
      isActive: medicines.isActive,
      chargeId: medicineCharges.id,
      expiryDate: medicineCharges.expiryDate,
      quantity: medicineCharges.quantity,
      storageLocation: medicineCharges.storageLocation,
      expiryAlertDays: medicineCharges.expiryAlertDays,
      chargeCreateAt: medicineCharges.createdAt,
      notes: medicineCharges.notes,
    })
    .from(medicines)
    [expiredOnly ? "innerJoin" : "leftJoin"](medicineCharges, chargeCondition)
    .where(inArray(medicines.id, idList))
    .orderBy(orderBy);

  // محاسبه تعداد کل
  let totalCountQuery = db
    .select({ count: sql<number>`count(DISTINCT ${medicines.id})` })
    .from(medicines)
    .$dynamic();

  if (joinCharges) {
    if (expiredOnly) {
      totalCountQuery = totalCountQuery.innerJoin(
        medicineCharges,
        chargeCondition,
      );
    } else {
      totalCountQuery = totalCountQuery.leftJoin(
        medicineCharges,
        chargeCondition,
      );
    }
  }
  const total = await totalCountQuery
    .where(and(...baseConditions))
    .then((r) => r[0]?.count ?? 0);

  // گروه‌بندی داده‌ها
  const groupedData = flatRows.reduce((acc, row) => {
    if (!acc.has(row.id)) {
      acc.set(row.id, {
        id: row.id,
        name: row.name,
        form: row.form,
        createdAt: row.createdAt,
        siteId: row.siteId,
        isActive: row.isActive,
        charges: [],
      });
    }

    if (row.chargeId) {
      acc.get(row.id).charges.push({
        id: row.chargeId,
        expiryDate: row.expiryDate,
        quantity: row.quantity,
        storageLocation: row.storageLocation,
        expiryAlertDays: row.expiryAlertDays,
        chargeCreateAt: row.chargeCreateAt,
        notes: row.notes,
      });
    }

    return acc;
  }, new Map<number, any>());

  const rows = idList.map((id) => groupedData.get(id)).filter(Boolean);

  return {
    rows,
    total,
  };
};
