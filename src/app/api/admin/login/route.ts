import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyCredentials,
  createSessionToken,
  ADMIN_COOKIE,
  SESSION_COOKIE_OPTIONS,
  getAllowedEmail,
} from "@/lib/auth/admin";
import { analyticsStore } from "@/lib/analytics/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "");
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const result = verifyCredentials(email, password);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 401 });
  }

  const token = createSessionToken(getAllowedEmail());
  cookies().set(ADMIN_COOKIE, token, SESSION_COOKIE_OPTIONS);

  // Audit-style analytics event.
  await analyticsStore.append({
    id: `e_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    name: "admin.login",
    timestamp: new Date().toISOString(),
    lang: "fr",
    sessionId: "admin",
  });

  return NextResponse.json({ ok: true });
}
