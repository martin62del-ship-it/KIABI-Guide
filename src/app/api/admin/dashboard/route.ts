import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/auth/admin";
import { getDashboard, type DashboardFilters } from "@/lib/analytics/store";
import type { Lang, RecommendationId } from "@/lib/config/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Protected: returns aggregated dashboard data with optional filters. */
export async function GET(req: Request) {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const filters: DashboardFilters = {
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
    lang: (url.searchParams.get("lang") as Lang | "all") ?? "all",
    recommendation: (url.searchParams.get("recommendation") as RecommendationId | "all") ?? "all",
  };

  const data = await getDashboard(filters);
  return NextResponse.json({ ok: true, data });
}
