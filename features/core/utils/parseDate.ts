import dayjs from './dayjs'
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
