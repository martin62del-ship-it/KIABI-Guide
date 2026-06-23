// =====================================================================
// Seed generator for demo analytics. Produces realistic-looking events
// over the last ~90 days so the admin dashboard is credible out of the box.
//
//   node scripts/seed-analytics.mjs            → writes data/analytics.seed.json
//   node scripts/seed-analytics.mjs --sessions 500
//
// This is DEMO data. Real events are appended to data/analytics.runtime.json
// at runtime via /api/analytics.
// =====================================================================

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "analytics.seed.json");

const args = process.argv.slice(2);
const sessionsArg = args.indexOf("--sessions");
const SESSIONS = sessionsArg >= 0 ? Number(args[sessionsArg + 1]) : 320;
const DAYS = 90;

const QUESTION_OPTIONS = {
  main_goal: ["ai_assistant", "automate_ms", "custom_tool", "explore", "unsure"],
  microsoft_dependency: ["ms_central", "ms_some", "ms_no", "ms_unknown"],
  microsoft_tools: ["m365", "sharepoint", "power_automate", "power_apps", "reporting"],
  solution_shape: ["assistant", "workflow", "app", "product", "buy"],
  complexity: ["simple", "medium", "complex"],
  custom_dev: ["no_dev", "maybe_dev", "yes_dev"],
  market_tool: ["market_yes", "market_maybe", "market_no"],
  readiness: ["ready", "shaping", "learn_first"],
};

// weighted recommendation distribution
const REC_WEIGHTS = [
  ["easy_ia", 38],
  ["easy_microsoft", 27],
  ["gen_ia_factory", 12],
  ["external_tool", 9],
  ["faq", 9],
  ["generic", 5],
];

const rnd = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rnd(arr.length)];
const chance = (p) => Math.random() < p;

function weighted(pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of pairs) {
    if ((r -= w) <= 0) return v;
  }
  return pairs[0][0];
}

let counter = 0;
const eid = () => `e_seed_${(counter++).toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

function mk(name, ts, lang, sessionId, props) {
  return { id: eid(), name, timestamp: ts.toISOString(), lang, sessionId, props };
}

function randomDate() {
  const now = Date.now();
  const past = now - DAYS * 24 * 3600 * 1000;
  // bias toward more recent days
  const r = Math.pow(Math.random(), 0.6);
  const t = past + r * (now - past);
  const d = new Date(t);
  d.setHours(8 + rnd(11), rnd(60), rnd(60), 0); // working hours
  return d;
}

function buildSession() {
  const events = [];
  const lang = chance(0.78) ? "fr" : "en";
  const sessionId = `s_seed_${Math.random().toString(36).slice(2, 12)}`;
  let ts = randomDate();
  const step = () => {
    ts = new Date(ts.getTime() + (4 + rnd(40)) * 1000);
    return ts;
  };

  events.push(mk("landing.viewed", step(), lang, sessionId));
  if (chance(0.1)) {
    // bounce on landing
    return events;
  }

  events.push(mk("guide.cta_clicked", step(), lang, sessionId, { from: pick(["hero", "how-it-works"]) }));
  events.push(mk("guide.journey_started", step(), lang, sessionId));

  const goal = weighted([
    ["ai_assistant", 34],
    ["automate_ms", 24],
    ["custom_tool", 12],
    ["explore", 18],
    ["unsure", 12],
  ]);

  // build a plausible visible path mirroring the real branching
  const path = ["main_goal"];
  if (goal !== "explore") {
    path.push("microsoft_dependency");
  }
  // we don't know dep yet; decide it
  const askedQuestions = { main_goal: goal };

  const view = (qid, answerId) => {
    events.push(mk("guide.question_viewed", step(), lang, sessionId, { questionId: qid }));
    events.push(mk("guide.answer_selected", step(), lang, sessionId, { questionId: qid, answerId }));
    askedQuestions[qid] = answerId;
  };

  view("main_goal", goal);

  if (goal !== "explore") {
    const dep = weighted([
      ["ms_central", goal === "automate_ms" ? 50 : 18],
      ["ms_some", 30],
      ["ms_no", 28],
      ["ms_unknown", 10],
    ]);
    view("microsoft_dependency", dep);

    if (dep === "ms_central" || dep === "ms_some") {
      // multi-select: emit 1-3 selections
      const tools = QUESTION_OPTIONS.microsoft_tools.slice();
      const n = 1 + rnd(3);
      for (let i = 0; i < n; i++) {
        const a = tools.splice(rnd(tools.length), 1)[0];
        events.push(mk("guide.answer_selected", step(), lang, sessionId, { questionId: "microsoft_tools", answerId: a }));
      }
      events.push(mk("guide.question_viewed", step(), lang, sessionId, { questionId: "microsoft_tools" }));
    }

    const shape = weighted([
      ["assistant", goal === "ai_assistant" ? 45 : 16],
      ["workflow", goal === "automate_ms" ? 40 : 16],
      ["app", 18],
      ["product", goal === "custom_tool" ? 40 : 8],
      ["buy", 12],
    ]);
    view("solution_shape", shape);

    const complexity = weighted([
      ["simple", 36],
      ["medium", 40],
      ["complex", goal === "custom_tool" ? 50 : 18],
    ]);
    view("complexity", complexity);

    if (complexity !== "simple") {
      view("custom_dev", weighted([["no_dev", 34], ["maybe_dev", 30], ["yes_dev", 36]]));
    }
    if (shape !== "buy") {
      view("market_tool", weighted([["market_yes", 22], ["market_maybe", 30], ["market_no", 48]]));
    }
  }

  view("readiness", weighted([["ready", 52], ["shaping", 30], ["learn_first", 18]]));

  // abandon?
  if (chance(0.16)) {
    events.push(mk("guide.journey_abandoned", step(), lang, sessionId, { questionId: pick(path) }));
    return events;
  }

  // recommendation (loosely correlated with the goal)
  let rec;
  if (goal === "explore") rec = chance(0.8) ? "faq" : "generic";
  else if (goal === "automate_ms") rec = chance(0.78) ? "easy_microsoft" : weighted(REC_WEIGHTS);
  else if (goal === "ai_assistant") rec = chance(0.74) ? "easy_ia" : weighted(REC_WEIGHTS);
  else if (goal === "custom_tool") rec = chance(0.7) ? "gen_ia_factory" : weighted(REC_WEIGHTS);
  else rec = weighted(REC_WEIGHTS);

  events.push(mk("guide.journey_completed", step(), lang, sessionId, { recommendation: rec }));
  events.push(mk("result.displayed", step(), lang, sessionId, { recommendation: rec }));

  // downstream clicks
  if (rec === "easy_ia" && chance(0.55)) {
    events.push(mk("result.booking_clicked", step(), lang, sessionId, { target: chance(0.5) ? "gautier" : "loic", linkType: "booking" }));
  } else if (rec === "easy_microsoft" && chance(0.55)) {
    events.push(mk("result.booking_clicked", step(), lang, sessionId, { target: "matthieu", linkType: "booking" }));
  } else if (rec === "gen_ia_factory" && chance(0.4)) {
    events.push(mk("result.contact_clicked", step(), lang, sessionId, { target: "younes", linkType: "contact" }));
  } else if (rec === "external_tool" && chance(0.4)) {
    events.push(mk("result.contact_clicked", step(), lang, sessionId, { target: "justine", linkType: "contact" }));
  } else if (rec === "faq" && chance(0.6)) {
    events.push(mk("result.faq_clicked", step(), lang, sessionId, { target: `faq:${rnd(3)}`, linkType: "faq" }));
  } else if (rec === "generic" && chance(0.45)) {
    events.push(mk("result.contact_clicked", step(), lang, sessionId, { target: "generic", linkType: "contact" }));
  }

  // occasional language switch mid-journey
  if (chance(0.06)) {
    events.push(mk("app.language_switched", step(), lang, sessionId, { to: lang === "fr" ? "en" : "fr" }));
  }

  return events;
}

async function main() {
  const all = [];
  for (let i = 0; i < SESSIONS; i++) all.push(...buildSession());

  // a few admin logins
  for (let i = 0; i < 6; i++) {
    const d = randomDate();
    all.push(mk("admin.login", d, "fr", "admin", undefined));
    all.push(mk("admin.dashboard_viewed", new Date(d.getTime() + 4000), "fr", "admin", undefined));
  }

  all.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  // Compact JSON keeps the committed demo file lean.
  await fs.writeFile(OUT, JSON.stringify(all), "utf8");
  console.log(`✓ Wrote ${all.length} demo events (${SESSIONS} sessions) → ${path.relative(process.cwd(), OUT)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
