import dayjs from "@/features/core/utils/dayjs";
import { Row, Charge } from "@/features/dashboard-medicine/type";
import { formMedicineMapper } from "@/features/dashboard-medicine/const";
import {
  getMedicineStock,
  getMinDaysToExpire,
  getMinWarnDays,
} from "@/features/dashboard-medicine/utils/medicineList";

type ExportMedicineRow = {
  id: number;
  name: string;
  form: string;
  createdAt: string;
  isActive: string;
  stock: number | string;
  minDaysToExpire: number | string;

  chargeQuantity: number | string;
  chargeCreateAt: string;
  chargeExpiryDate: string;
  chargeStorageLocation: string;
};

export function flattenMedicineRowsForExcel(rows: Row[], baseToday: any): ExportMedicineRow[] {
  const out: ExportMedicineRow[] = [];

  for (const r of rows ?? []) {
    const charges = (r.charges ?? []) as Charge[];

    const base = {
      id: r.id,
      name: r.name,
      form: formMedicineMapper[r.form as keyof typeof formMedicineMapper] ?? r.form,
      createdAt: r.createdAt ? dayjs(r.createdAt).calendar("jalali").format("YYYY/MM/DD") : "",
      isActive: r.isActive ? "فعال" : "غیرفعال",
      stock: getMedicineStock(charges),
      minDaysToExpire: (() => {
        const minDays = getMinDaysToExpire(charges, baseToday);
        const minWarn = getMinWarnDays(charges);
        if (minDays === null || minWarn === null) return "—";
        return minDays;
      })(),
    };

    if (!charges.length) {
      out.push({
        ...base,
        chargeQuantity: "",
        chargeCreateAt: "",
        chargeExpiryDate: "",
        chargeStorageLocation: "",
      });
      continue;
    }

    for (const c of charges) {
      out.push({
        ...base,
        chargeQuantity: c.quantity ?? "",
        chargeCreateAt: c.chargeCreateAt
          ? dayjs(c.chargeCreateAt).format("YYYY/MM/DD")
          : "",
        chargeExpiryDate: c.expiryDate
          ? dayjs(c.expiryDate).format("YYYY/MM/DD")
          : "",
        chargeStorageLocation: c.storageLocation ?? "محل نامشخص",
      });
    }
  }

  return out;
}
