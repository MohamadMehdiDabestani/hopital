import { getUser } from "@/features/auth/utils/dal";
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

  const initialData = await getAdmisionHistoryQuery({
    siteId: Number(currentUser?.siteId),
    page,
    pageSize,
    sortModel,
    filterModel,
  });
  
  return <DashboardAdmisionHistory initialData={initialData}/>
}
