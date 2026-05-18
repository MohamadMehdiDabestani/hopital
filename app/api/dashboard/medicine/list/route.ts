import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import {
  medicineCharges,
  medicines,
} from "@/features/core/schema/schema.drizzle";
import { and, eq, sql, inArray } from "drizzle-orm";
import {
  parseGridParams,
  buildWhere,
  buildOrderBy,
} from "@/features/core/utils/filterDatagrid";
import { getUser } from "@/features/auth/utils/dal";

const columnMap = {
  id: medicines.id,
  name: medicines.name,
  form: medicines.form,
  createdAt: medicines.createdAt,
  siteId: medicines.siteId,
  isActive: medicines.isActive,
  expiryDate: medicineCharges.expiryDate,
  quantity: medicineCharges.quantity,
  storageLocation: medicineCharges.storageLocation,
  expiryAlertDays: medicineCharges.expiryAlertDays,
  chargeCreateAt: medicineCharges.createdAt,
};

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

    const where = buildWhere(columnMap, filterModel, [
      medicines.name,
      medicineCharges.storageLocation,
    ]);
    const baseConditions = [
      eq(medicines.siteId, Number(currentUser.siteId)),
      where,
    ];
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
    const orderBy = buildOrderBy(columnMap, sortModel, medicines.id);

    const { flatRows, total, idList } = await db.transaction(async (tx) => {
      const ids = await tx
        .selectDistinct({ id: medicines.id })
        .from(medicines)
        .leftJoin(medicineCharges, eq(medicines.id, medicineCharges.medicineId))
        .where(and(...baseConditions))
        .orderBy(orderBy)
        .limit(pageSize)
        .offset(page * pageSize);

      const total = await tx
        .select({ count: sql<number>`count(*)` })
        .from(medicines)
        .leftJoin(medicineCharges, eq(medicines.id, medicineCharges.medicineId))
        .where(and(...baseConditions))
        .then((r) => r[0]?.count ?? 0);

      const idList = ids.map((x) => x.id);

      if (!idList.length) {
        return { flatRows: [], total, idList };
      }

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
        .orderBy(orderBy)
        .where(inArray(medicines.id, idList));

      return { flatRows, total, idList };
    });

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
