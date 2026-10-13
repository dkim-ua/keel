import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin authentication: one shared password (ADMIN_PASSWORD) and a signed,
 * HTTP-only session cookie. Changing the password signs everyone out.
 */

export const ADMIN_COOKIE = "keel_admin";
const SESSION_DAYS = 30;

export function adminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD?.trim();
}

function secret(): string {
  const explicit = process.env.ADMIN_SECRET?.trim();
  if (explicit) return explicit;
  return createHash("sha256").update(`keel-admin|${process.env.ADMIN_PASSWORD ?? ""}`).digest("hex");
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  // Compare hashes so the comparison time does not depend on the password length.
  const h = (v: string) => createHash("sha256").update(v).digest("hex");
  return safeEqual(h(candidate), h(expected));
}

export function createSessionToken(now = Date.now()): string {
  const expires = String(now + SESSION_DAYS * 86_400_000);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token || !adminConfigured()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < now) return false;
  return safeEqual(signature, sign(expires));
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 86_400,
};

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
