import { ActionErrorMapping } from "@/features/core/utils/actionErrorMapping";
import { getVisitMedicinesQuery } from "@/features/dashboard-medicine/queries/dashboard-medicine.queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const visitIdParams = searchParams.get("visitId");
    if (visitIdParams) {
      const visitId = parseInt(visitIdParams);

      const data = await getVisitMedicinesQuery(visitId);
      return NextResponse.json({ ok: true, data: data });
    } else
      return NextResponse.json({
        ok: false,
        message: "اطلاعات وارد شده ناقض میباشد",
      });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ ok: false, message: ActionErrorMapping(error) });
  }
}
