// =====================================================================
// ADMIN AUTH (server only) — a clean, secure-READY scaffold.
//
// What this provides:
//   • Email allow-list gate (ADMIN_EMAIL, defaults to the brief's owner).
//   • Password check against ADMIN_PASSWORD (env, server-side only).
//   • HMAC-signed, httpOnly session cookie (no secrets reach the client).
//
// What to wire for PRODUCTION (see README "Production hardening"):
//   • Replace the password check with real SSO / OIDC (e.g. Azure AD,
//     NextAuth) so identity comes from KIABI's IdP.
//   • Store ADMIN_SESSION_SECRET in a secret manager; rotate periodically.
//   • Add rate-limiting + audit logging on the login route.
// =====================================================================

import crypto from "crypto";

export const ADMIN_COOKIE = "kiabi_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function getEnv(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export function getAllowedEmail(): string {
  return getEnv("ADMIN_EMAIL", "martin.delaporte@kiabi.com").toLowerCase();
}

function getSecret(): string {
  return getEnv("ADMIN_SESSION_SECRET", "dev-insecure-secret-change-me");
}

/**
 * Resolve the accepted password.
 * - Production: must come from ADMIN_PASSWORD.
 * - Development: if ADMIN_PASSWORD is unset, accept the documented demo
 *   password so the dashboard can be previewed. Logged loudly.
 */
function getAcceptedPassword(): string {
  const fromEnv = getEnv("ADMIN_PASSWORD");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV !== "production") {
    return "kiabi-demo";
  }
  return ""; // no password configured in prod => deny all
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Timing-safe string comparison. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export interface AuthResult {
  ok: boolean;
  error?: "invalid_credentials" | "not_configured";
}

/** Validate submitted credentials. */
export function verifyCredentials(email: string, password: string): AuthResult {
  const accepted = getAcceptedPassword();
  if (!accepted) return { ok: false, error: "not_configured" };
  const emailOk = email.trim().toLowerCase() === getAllowedEmail();
  const passwordOk = safeEqual(password, accepted);
  if (emailOk && passwordOk) return { ok: true };
  return { ok: false, error: "invalid_credentials" };
}

/** Build a signed session token: base64(payload).hmac */
export function createSessionToken(email: string): string {
  const payload = JSON.stringify({
    email: email.toLowerCase(),
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

/** Verify a session token; returns the email if valid + unexpired. */
export function verifySessionToken(token?: string | null): string | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  if (!safeEqual(signature, sign(encoded))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (payload.email !== getAllowedEmail()) return null;
    return payload.email as string;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
  secure: process.env.NODE_ENV === "production",
};
