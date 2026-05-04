import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const roleAccess: Record<string, string[]> = {
  "/admin": ["admin"],
  "/manager": ["admin", "manager"],
  "/doctor": ["admin", "doctor"],
};

async function verifyAccess(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { sub: string; role: string };
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth/refresh") || pathname.startsWith("/")) {
    return NextResponse.next();
  }

  const access = req.cookies.get("access_token")?.value;
  const refresh = req.cookies.get("refresh_token")?.value;

  // اگر access نداریم اما refresh داریم → برو برای رفرش
  if (!access && refresh) {
    const url = new URL("/api/auth/refresh", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // اگر اصلا توکن نداریم → لاگین
  if (!access) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const payload = await verifyAccess(access);

    // نقش‌ها
    for (const [path, roles] of Object.entries(roleAccess)) {
      if (pathname.startsWith(path) && !roles.includes(payload.role)) {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }

    return NextResponse.next();
  } catch (err: any) {
    // access منقضی شده → برو رفرش
    if (refresh) {
      const url = new URL("/api/auth/refresh", req.url);
      url.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*", "/doctor/:path*"],
};
