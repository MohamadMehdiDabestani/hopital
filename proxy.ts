import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./features/core";
const ROLE_ROUTES: Record<string, string[]> = {
  doctor: [
    "/dashboard/doctor",
    "/api/dashboard/doctor",
    "/api/dashboard/admision/streamQueue",
  ],
  admision: ["/dashboard/admision", "/api/dashboard/admision"],
  medicine: [
    "/dashboard/medicine",
    "/api/dashboard/medicine",
    "/api/dashboard/admision/streamQueue",
  ],
  manager: ["/dashboard/manager", "/api/dashboard/manager"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = new URL(req.url);


  const access = req.cookies.get("access_token")?.value;
  if (!access) return NextResponse.redirect(new URL("/", req.url));

  try {
    const user = await verifyToken(access);
    const allowed = ROLE_ROUTES[user.role as string] ?? [];
    const hasAccess = allowed.some((p) => pathname.startsWith(p));
    if (!hasAccess) {
      return NextResponse.redirect(new URL(allowed[0] ?? "/", req.url));
    }

    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("access_token");
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
