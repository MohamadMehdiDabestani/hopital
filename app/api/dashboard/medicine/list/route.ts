import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/core/drizzle/client";
import {
  medicineCharges,
  medicines,
  sites,
} from "@/features/core/schema/schema.drizzle";
import { and, eq, sql } from "drizzle-orm";
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
  createAt: medicines.createdAt,
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
    const { page, pageSize, sortModel, filterModel } = parseGridParams(req.url);
    const currentUser = await getUser();
    if (!currentUser)
      return NextResponse.json(
        { ok: false, message: "مشکلی پیش آمده" },
        { status: 401 },
      );
    const where = buildWhere(columnMap, filterModel, [
      medicines.name,
      medicineCharges.storageLocation,
    ]);

    const orderBy = buildOrderBy(columnMap, sortModel, medicines.id);

    const [flatRows, total] = await Promise.all([
      db
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
        .where(and(eq(medicines.siteId, Number(currentUser?.siteId)), where))
        .orderBy(orderBy)
        .limit(pageSize)
        .offset(page * pageSize),

      db
        .select({ count: sql<number>`count(distinct ${medicines.id})` })
        .from(medicines)
        .leftJoin(medicineCharges, eq(medicines.id, medicineCharges.medicineId))
        .where(and(eq(medicines.siteId, Number(currentUser?.siteId)), where))
        .then((r) => r[0]?.count ?? 0),
    ]);

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
          chargesId: r.chargeId,
          expiryDate: r.expiryDate,
          quantity: r.quantity,
          storageLocation: r.storageLocation,
          expiryAlertDays: r.expiryAlertDays,
          chargeCreateAt: r.chargeCreateAt,
        });
      }
    }

    const rows = Array.from(map.values());

    return NextResponse.json({ ok: true, rows, total });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, message: "مشکلی پیش آمده" });
  }
}
