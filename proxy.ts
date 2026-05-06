import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./features/core";


export async function proxy(req: NextRequest) {

  const access = req.cookies.get("access_token")?.value;
  if (!access) return NextResponse.redirect(new URL("/", req.url));

  try {
    await verifyToken(access);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("access_token");
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
