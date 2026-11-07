import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

const COOKIE = "argh_admin";
const key = () => {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET mancante o troppo corto (min 32 caratteri)");
  return new TextEncoder().encode(s);
};
const eq = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function checkCredentials(user: string, pass: string) {
  const u = process.env.ADMIN_USER, p = process.env.ADMIN_PASSWORD;
  return !!u && !!p && eq(user, u) && eq(pass, p);
}
export async function createSession() {
  const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d").sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 7,
  });
}
export async function destroySession() { (await cookies()).delete(COOKIE); }
export async function isAdmin() {
  const t = (await cookies()).get(COOKIE)?.value;
  if (!t) return false;
  try { await jwtVerify(t, key()); return true; } catch { return false; }
}
