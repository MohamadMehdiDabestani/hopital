"use server";
import dayjs from "@/features/core/utils/dayjs";

export async function getServerTime() {
  const tehran = dayjs().tz("Asia/Tehran");

  const jalali = tehran.calendar("jalali");
  const gregorian = tehran.calendar("gregory");

  return {
    jalaliDate: jalali.format("YYYY/MM/DD"),
    jalaliDateTime: jalali.format("YYYY/MM/DD HH:mm:ss"),
  };
}
