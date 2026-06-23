import { NextResponse } from "next/server";
import { analyticsStore } from "@/lib/analytics/store";
import { EVENT_LABELS } from "@/lib/analytics/events";
import type { AnalyticsEvent, EventName } from "@/lib/analytics/events";
import type { Lang } from "@/lib/config/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_NAMES = new Set(Object.keys(EVENT_LABELS) as EventName[]);

/** Ingest a single analytics event (fire-and-forget from the client). */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body?.name as EventName;
    if (!name || !VALID_NAMES.has(name)) {
      return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
    }
    const lang: Lang = body?.lang === "en" ? "en" : "fr";
    const event: AnalyticsEvent = {
      id: `e_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      name,
      timestamp: typeof body?.timestamp === "string" ? body.timestamp : new Date().toISOString(),
      lang,
      sessionId: typeof body?.sessionId === "string" ? body.sessionId.slice(0, 64) : "unknown",
      props: typeof body?.props === "object" && body.props ? body.props : undefined,
    };
    await analyticsStore.append(event);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
