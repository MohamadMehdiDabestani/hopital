import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import {
  medicineCharges,
  medicines,
} from "@/features/core/schema/schema.drizzle";
import { and, eq, sql, inArray, SQL } from "drizzle-orm";
import {
  parseGridParams,
  buildWhere,
  buildOrderBy,
} from "@/features/core/utils/filterDatagrid";
import { getUser } from "@/features/auth/utils/dal";

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
    // چون quickFilter روی storageLocation هم می‌خوره
    return true;
  }
  return false;
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getUser();
    if (!currentUser) {
      return NextResponse.json(
        { ok: false, message: "مشکلی پیش آمده" },
        { status: 401 },
      );
    }

    const { page, pageSize, sortModel, filterModel } = parseGridParams(req.url);
    const { searchParams } = new URL(req.url);
    const expiredOnly = searchParams.get("expired") === "true";

    const joinCharges = needsChargeJoin(sortModel, filterModel, expiredOnly);

    const where = buildWhere(
      joinCharges ? fullColumnMap : baseColumnMap,
      filterModel,
      joinCharges
        ? [medicines.name, medicineCharges.storageLocation]
        : [medicines.name],
    );

    const baseConditions = [
      eq(medicines.siteId, Number(currentUser.siteId)),
      where,
    ].filter((x): x is SQL => Boolean(x));

    if (expiredOnly) {
      baseConditions.push(sql`
        exists (
          select 1
          from ${medicineCharges} c
          where c."medicineId" = ${medicines.id}
            and c."expiryDate" is not null
            and c."expiryAlertDays" is not null
            and (c."expiryDate"::date - current_date) <= c."expiryAlertDays"
        )
      `);
    }

    const orderBy = buildOrderBy(
      joinCharges ? fullColumnMap : baseColumnMap,
      sortModel,
      medicines.id,
    );

    const { flatRows, total, idList } = await db.transaction(async (tx) => {
      const idsQuery = tx
        .select({ id: medicines.id })
        .from(medicines)
        .$dynamic();

      const totalQuery = tx
        .select({ count: sql<number>`count(distinct ${medicines.id})` })
        .from(medicines)
        .$dynamic();

      if (joinCharges) {
        idsQuery.leftJoin(
          medicineCharges,
          eq(medicines.id, medicineCharges.medicineId),
        );
        totalQuery.leftJoin(
          medicineCharges,
          eq(medicines.id, medicineCharges.medicineId),
        );
      }

      const ids = await idsQuery
        .where(and(...baseConditions))
        .groupBy(medicines.id)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset(page * pageSize);

      const total = await totalQuery
        .where(and(...baseConditions))
        .then((r) => r[0]?.count ?? 0);

      const idList = ids.map((x) => x.id);
      if (!idList.length) return { flatRows: [], total, idList };

      const flatRows = await tx
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
        })
        .from(medicines)
        .leftJoin(medicineCharges, eq(medicines.id, medicineCharges.medicineId))
        .where(inArray(medicines.id, idList))
        .orderBy(orderBy);

      return { flatRows, total, idList };
    });

    // همان map قبلی
    const map = new Map<number, any>();
    for (const r of flatRows) {
      if (!map.has(r.id)) {
        map.set(r.id, {
          id: r.id,
          name: r.name,
          form: r.form,
          createdAt: r.createdAt,
          siteId: r.siteId,
          isActive: r.isActive,
          charges: [],
        });
      }
      if (r.chargeId) {
        map.get(r.id).charges.push({
          id: r.chargeId,
          expiryDate: r.expiryDate,
          quantity: r.quantity,
          storageLocation: r.storageLocation,
          expiryAlertDays: r.expiryAlertDays,
          chargeCreateAt: r.chargeCreateAt,
        });
      }
    }

    const rows = idList.map((id) => map.get(id)).filter(Boolean);

    return NextResponse.json({ ok: true, rows, total });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, message: "مشکلی پیش آمده" });
  }
}
