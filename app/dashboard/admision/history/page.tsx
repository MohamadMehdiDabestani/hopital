import { getUser } from "@/features/auth/utils/dal";
import { jalaliToGregorian } from "@/features/core/utils/serverDateTimeParser";
import { DashboardAdmisionHistory } from "@/features/dasboard-admision";
import { getAdmisionHistoryQuery } from "@/features/dasboard-admision/queries/dasboard-admision.queries";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentUser = await getUser();
  const params = await searchParams;

  const page = Number(params.page) || 0;
  const pageSize = Number(params.pageSize) || 10;

  const sortModel = params.sort
    ? JSON.parse(params.sort as string)
    : [];

  const filterModel = params.filter
    ? JSON.parse(params.filter as string)
    : { items: [] };

  // تبدیل تاریخ شمسی به میلادی
  let fromDateTimeGregorian: string | undefined;
  let toDateTimeGregorian: string | undefined;

  if (params.fromDateTime) {
    fromDateTimeGregorian = jalaliToGregorian(params.fromDateTime as string);
  }

  if (params.toDateTime) {
    toDateTimeGregorian = jalaliToGregorian(params.toDateTime as string);
  }

  console.log("Input from:", params.fromDateTime);
  console.log("Converted from:", fromDateTimeGregorian);
  console.log("Input to:", params.toDateTime);
  console.log("Converted to:", toDateTimeGregorian);

  const initialData = await getAdmisionHistoryQuery({
    siteId: Number(currentUser?.siteId),
    page,
    pageSize,
    sortModel,
    filterModel,
    fromDateTime: fromDateTimeGregorian,
    toDateTime: toDateTimeGregorian,
  });

  return <DashboardAdmisionHistory initialData={initialData} />
}