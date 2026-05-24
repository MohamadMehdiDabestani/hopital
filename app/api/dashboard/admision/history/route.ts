import { NextRequest, NextResponse } from "next/server";
import { parseGridParams } from "@/features/core/utils/filterDatagrid";
import { getUser } from "@/features/auth/utils/dal";
import { getAdmisionHistoryQuery } from "@/features/dasboard-admision/queries/dasboard-admision.queries";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getUser();
    const { page, pageSize, sortModel, filterModel } = parseGridParams(req.url);
    const { rows, total } = await getAdmisionHistoryQuery({
      siteId: Number(currentUser?.siteId),
      page,
      pageSize,
      sortModel,
      filterModel,
    });

    return NextResponse.json({ ok: true, rows, total });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({
      ok: false,
      message: "مشکلی پیش آمده",
      error: String(error),
    });
  }
}
