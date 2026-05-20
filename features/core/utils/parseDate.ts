import dayjs from "./dayjs";
export const parseDate = (
  date: string | undefined | null,
  isGregorian: boolean,
): Date | undefined => {
  if (!date) return undefined;

  try {
    if (isGregorian) {
      return dayjs(date).startOf("day").toDate();
    } else {
      return dayjs(date, { jalali: true }).startOf("day").toDate();
    }
  } catch {
    return undefined;
  }
};
export const formatDate = (date: string | Date, isGregorian: boolean) => {
  if (!date) return "";
  if (isGregorian) {
    return dayjs(date).format("YYYY/MM/DD");
  }
  return dayjs(date).calendar("jalali").format("YYYY/MM/DD");
};
