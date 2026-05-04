import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/features/core/utils";

const roleAccess: Record<string, string[]> = {
  "/admin": ["admin"],
  "/manager": ["admin", "manager"],
  "/doctor": ["admin", "doctor"],
};

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const payload = await verifyToken(token);

    for (const [path, roles] of Object.entries(roleAccess)) {
      if (req.nextUrl.pathname.startsWith(path)) {
        if (!roles.includes(payload.role ?? "")) {
          return NextResponse.redirect(new URL("/403", req.url));
        }
      }
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/login/:path*",
    "/admin/:path*",
    "/manager/:path*",
    "/doctor/:path*",
  ],
};
