// =====================================================================
// ANALYTICS STORE (server only) — lightweight, swappable adapter.
//
// Default implementation = file-backed JSON with an in-memory fallback,
// perfect for an internal tool / preview. The `AnalyticsStore` interface
// is the seam to plug a real DB (Postgres, etc.) later — see README.
//
// Seed (committed):   data/analytics.seed.json     → demo data, read-only
// Runtime (gitignored): data/analytics.runtime.json → live appended events
// =====================================================================

import { promises as fs } from "fs";
import path from "path";
import { EVENTS } from "./events";
import type { AnalyticsEvent } from "./events";
import type { Lang, RecommendationId } from "@/lib/config/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SEED_FILE = path.join(DATA_DIR, "analytics.seed.json");
const RUNTIME_FILE = path.join(DATA_DIR, "analytics.runtime.json");

export interface AnalyticsStore {
  append(event: AnalyticsEvent): Promise<void>;
  all(): Promise<AnalyticsEvent[]>;
}

// In-memory buffer of runtime events (covers read-only filesystems).
let memoryBuffer: AnalyticsEvent[] | null = null;
let seedCache: AnalyticsEvent[] | null = null;

async function readJson(file: string): Promise<AnalyticsEvent[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

async function loadSeed(): Promise<AnalyticsEvent[]> {
  if (seedCache) return seedCache;
  seedCache = await readJson(SEED_FILE);
  return seedCache;
}

const fileStore: AnalyticsStore = {
  async append(event) {
    if (memoryBuffer === null) memoryBuffer = await readJson(RUNTIME_FILE);
    memoryBuffer.push(event);
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(RUNTIME_FILE, JSON.stringify(memoryBuffer, null, 2), "utf8");
    } catch {
      /* read-only FS — keep events in memory for this process lifetime */
    }
  },
  async all() {
    if (memoryBuffer === null) memoryBuffer = await readJson(RUNTIME_FILE);
    const seed = await loadSeed();
    return [...seed, ...memoryBuffer];
  },
};

export const analyticsStore: AnalyticsStore = fileStore;

// ---------------------------------------------------------------------
// Aggregation — turns raw events into the dashboard model.
// ---------------------------------------------------------------------

export interface DashboardFilters {
  from?: string; // ISO date (inclusive)
  to?: string; // ISO date (inclusive)
  lang?: Lang | "all";
  recommendation?: RecommendationId | "all";
}

export interface DashboardData {
  totals: {
    visits: number;
    sessions: number;
    starts: number;
    completions: number;
    completionRate: number;
  };
  distribution: { id: RecommendationId; count: number }[];
  answers: {
    questionId: string;
    total: number;
    options: { answerId: string; count: number }[];
  }[];
  clicks: {
    booking: { target: string; count: number }[];
    contact: { target: string; count: number }[];
    faq: { target: string; count: number }[];
  };
  timeseries: { date: string; sessions: number; completions: number }[];
  eventsConsidered: number;
  hasRuntimeData: boolean;
}

function withinRange(ts: string, from?: string, to?: string): boolean {
  const t = new Date(ts).getTime();
  if (from && t < new Date(from).getTime()) return false;
  if (to) {
    // make `to` inclusive of the whole day
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    if (t > end.getTime()) return false;
  }
  return true;
}

export async function getDashboard(filters: DashboardFilters = {}): Promise<DashboardData> {
  const allEvents = await analyticsStore.all();
  const runtimeCount = memoryBuffer?.length ?? 0;

  // Apply filters (date + language). Recommendation filter is applied to
  // session-scoped views below where it makes sense.
  let events = allEvents.filter((e) => withinRange(e.timestamp, filters.from, filters.to));
  if (filters.lang && filters.lang !== "all") {
    events = events.filter((e) => e.lang === filters.lang);
  }

  // Optional: restrict to sessions that ended on a given recommendation.
  if (filters.recommendation && filters.recommendation !== "all") {
    const matchingSessions = new Set(
      events
        .filter(
          (e) =>
            e.name === EVENTS.RESULT_DISPLAYED &&
            e.props?.recommendation === filters.recommendation,
        )
        .map((e) => e.sessionId),
    );
    events = events.filter((e) => matchingSessions.has(e.sessionId));
  }

  const sessions = new Set(events.map((e) => e.sessionId));
  const count = (name: string) => events.filter((e) => e.name === name).length;

  const starts = count(EVENTS.JOURNEY_STARTED);
  const completions = count(EVENTS.JOURNEY_COMPLETED);

  // Recommendation distribution from result.displayed
  const distMap = new Map<RecommendationId, number>();
  for (const e of events) {
    if (e.name === EVENTS.RESULT_DISPLAYED && e.props?.recommendation) {
      const r = e.props.recommendation as RecommendationId;
      distMap.set(r, (distMap.get(r) ?? 0) + 1);
    }
  }
  const distribution = [...distMap.entries()]
    .map(([id, c]) => ({ id, count: c }))
    .sort((a, b) => b.count - a.count);

  // Answers per question
  const answersMap = new Map<string, Map<string, number>>();
  for (const e of events) {
    if (e.name === EVENTS.ANSWER_SELECTED && e.props?.questionId && e.props?.answerId) {
      const q = e.props.questionId as string;
      const a = e.props.answerId as string;
      if (!answersMap.has(q)) answersMap.set(q, new Map());
      const inner = answersMap.get(q)!;
      inner.set(a, (inner.get(a) ?? 0) + 1);
    }
  }
  const answers = [...answersMap.entries()].map(([questionId, inner]) => {
    const options = [...inner.entries()]
      .map(([answerId, c]) => ({ answerId, count: c }))
      .sort((a, b) => b.count - a.count);
    const total = options.reduce((s, o) => s + o.count, 0);
    return { questionId, total, options };
  });

  // Clicks by link type + target
  const clickBuckets = {
    booking: new Map<string, number>(),
    contact: new Map<string, number>(),
    faq: new Map<string, number>(),
  };
  for (const e of events) {
    const target = (e.props?.target as string) ?? "unknown";
    if (e.name === EVENTS.BOOKING_CLICKED)
      clickBuckets.booking.set(target, (clickBuckets.booking.get(target) ?? 0) + 1);
    if (e.name === EVENTS.CONTACT_CLICKED)
      clickBuckets.contact.set(target, (clickBuckets.contact.get(target) ?? 0) + 1);
    if (e.name === EVENTS.FAQ_CLICKED)
      clickBuckets.faq.set(target, (clickBuckets.faq.get(target) ?? 0) + 1);
  }
  const toClickArray = (m: Map<string, number>) =>
    [...m.entries()].map(([target, c]) => ({ target, count: c })).sort((a, b) => b.count - a.count);

  // Daily timeseries (sessions started + completions)
  const tsMap = new Map<string, { sessions: Set<string>; completions: number }>();
  for (const e of events) {
    const day = e.timestamp.slice(0, 10);
    if (!tsMap.has(day)) tsMap.set(day, { sessions: new Set(), completions: 0 });
    const bucket = tsMap.get(day)!;
    bucket.sessions.add(e.sessionId);
    if (e.name === EVENTS.JOURNEY_COMPLETED) bucket.completions += 1;
  }
  const timeseries = [...tsMap.entries()]
    .map(([date, b]) => ({ date, sessions: b.sessions.size, completions: b.completions }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totals: {
      visits: count(EVENTS.LANDING_VIEWED),
      sessions: sessions.size,
      starts,
      completions,
      completionRate: starts > 0 ? Math.round((completions / starts) * 100) : 0,
    },
    distribution,
    answers,
    clicks: {
      booking: toClickArray(clickBuckets.booking),
      contact: toClickArray(clickBuckets.contact),
      faq: toClickArray(clickBuckets.faq),
    },
    timeseries,
    eventsConsidered: events.length,
    hasRuntimeData: runtimeCount > 0,
  };
}
