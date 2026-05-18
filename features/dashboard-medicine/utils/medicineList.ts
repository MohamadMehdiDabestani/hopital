import dayjs from "@/features/core/utils/dayjs";
import { Charge } from "@/features/dashboard-medicine/type";

export const getMedicineStock = (charges: Charge[] = []) => {
  return charges.reduce((sum, c) => sum + (c.quantity ?? 0), 0);
};

export const getMinDaysToExpire = (
  charges: Charge[] = [],
  baseToday: dayjs.Dayjs | null,
) => {
  if (!charges.length || !baseToday) return null;

  return Math.min(
    ...charges.map((c) =>
      dayjs(c.expiryDate).startOf("day").diff(baseToday, "day"),
    ),
  );
};

export const getMinWarnDays = (charges: Charge[] = []) => {
  if (!charges.length) return null;
  return Math.min(...charges.map((c) => c.expiryAlertDays ?? 0));
};

export const isChargeWarn = (
  charge: Charge,
  baseToday: dayjs.Dayjs | null,
) => {
  if (!baseToday) return false;

  const daysToExpire = dayjs(charge.expiryDate)
    .startOf("day")
    .diff(baseToday, "day");

  return daysToExpire <= (charge.expiryAlertDays ?? 0);
};
