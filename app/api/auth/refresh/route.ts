import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyToken,
  signAccessToken,
  signRefreshToken,
} from "@/features/core/";
import { hashToken } from "@/features/core/";
import {
  GetRefreshToken,
  UpdateRefreshToken,
} from "@/features/auth/queries/token.queries";
export async function GET(req : Request) {
  const cookie = await cookies();
  console.log("I GOT IT")
  const refresh = cookie.get("refresh_token")?.value;
  if (!refresh) return NextResponse.redirect("/");

  const payload = await verifyToken(refresh);
  const hashedToken = hashToken(refresh);

  const dbToken = await GetRefreshToken(hashedToken);

  if (!dbToken.ok) return NextResponse.redirect("/");

  // rotate
  const newAccess = await signAccessToken({
    sub: payload.sub,
    role: dbToken.data.role,
  });
  const newRefresh = await signRefreshToken({ sub: payload.sub });
  const updatedToken = await UpdateRefreshToken({ refresh : dbToken.data.tokenHash, newRefresh });

  
  const next = new URL(req.url).searchParams.get("next") || "/dashboard";
  const res = NextResponse.redirect(new URL(next, req.url));

  res.cookies.set("access_token", newAccess, {
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 15 * 60 * 1000),
  });
  res.cookies.set("refresh_token", newRefresh, {
    httpOnly: true,
    path: "/",
    expires: updatedToken.expiresAt as Date,
  });
  return res;
}
