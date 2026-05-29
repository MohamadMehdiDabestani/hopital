import { DashboardMedicineList } from "@/features/dashboard-medicine";
import { getMedicineListQuery } from "@/features/dashboard-medicine/queries/dashboard-medicine.queries";
import dayjs from "@/features/core/utils/dayjs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 0;
  const pageSize = Number(params.pageSize) || 10;

  const sortModel = params.sort ? JSON.parse(params.sort as string) : [];

  const filterModel = params.filter
    ? JSON.parse(params.filter as string)
    : { items: [] };
  const expiredOnly = params.expired
    ? JSON.parse(params.expired as string)
    : false;
  const initialData = await getMedicineListQuery({
    page,
    pageSize,
    sortModel,
    filterModel,
    expiredOnly,
  });

  return <DashboardMedicineList initialData={initialData} />;
}
