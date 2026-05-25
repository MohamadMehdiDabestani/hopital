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
import { getMedicineListQuery } from "@/features/dashboard-medicine/queries/dashboard-medicine.queries";

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
    const { page, pageSize, sortModel, filterModel } = parseGridParams(req.url);
    const { searchParams } = new URL(req.url);
    const expiredOnly = searchParams.get("expired") === "true";
    const { rows, total } = await getMedicineListQuery({
      page,
      pageSize,
      sortModel,
      filterModel,
      expiredOnly,
    });

    return NextResponse.json({ ok: true, rows, total });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, message: "مشکلی پیش آمده" });
  }
}
