import { SignJWT, jwtVerify } from "jose";
import crypto from 'crypto'
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signAccessToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function signRefreshToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { sub: string; role?: string };
}
export const hashToken = (token : string) => {
  return crypto.createHash("sha256").update(token).digest("hex")
}