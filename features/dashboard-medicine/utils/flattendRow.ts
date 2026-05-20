import {
  Row,
  Charge,
  DateTimeTrigger,
} from "@/features/dashboard-medicine/type";
import { formMedicineMapper } from "@/features/dashboard-medicine/const";
import {
  getMedicineStock,
  getMinDaysToExpire,
  getMinWarnDays,
} from "@/features/dashboard-medicine/utils/medicineList";
import { formatDate } from "@/features/core";

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
  chargeNotes: string;
};

export function flattenMedicineRowsForExcel(
  rows: Row[],
  baseToday: any,
  dateTimeTrigger: DateTimeTrigger,
): ExportMedicineRow[] {
  const out: ExportMedicineRow[] = [];
  const isGregorian = dateTimeTrigger === "miladi";

  for (const r of rows ?? []) {
    const charges = (r.charges ?? []) as Charge[];
    const base = {
      id: r.id,
      name: r.name,
      form:
        formMedicineMapper[r.form as keyof typeof formMedicineMapper] ?? r.form,
      createdAt: formatDate(r.createdAt, isGregorian),
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
        chargeNotes: "",
      });
      continue;
    }

    for (const c of charges) {
      out.push({
        ...base,
        chargeQuantity: c.quantity ?? "",
        chargeCreateAt: formatDate(c.chargeCreateAt, isGregorian),
        chargeExpiryDate: formatDate(c.expiryDate, isGregorian),
        chargeStorageLocation: c.storageLocation ?? "محل نامشخص",
        chargeNotes: c.notes ?? "وارد نشده",
      });
    }
  }

  return out;
}
