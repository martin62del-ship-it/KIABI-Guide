// =====================================================================
// Seed generator for demo analytics. Produces realistic-looking events
// over the last ~90 days so the admin dashboard is credible out of the box.
//
//   node scripts/seed-analytics.mjs            → writes data/analytics.seed.json
//   node scripts/seed-analytics.mjs --sessions 500
//
// This is DEMO data. Real events are appended to data/analytics.runtime.json
// at runtime via /api/analytics.
//
// The question/answer IDs and weights below MIRROR src/lib/config/questions.ts
// (and the scoring rules in src/lib/config/scoring.ts) so that simulated
// answers and the recommendation they lead to stay coherent in the admin.
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

// --- mirror of questions.ts: answer weights per category --------------
const WEIGHTS = {
  maturity: {
    ready: {},
    fuzzy: { generic: 2 },
    exploring: { faq: 4 },
  },
  main_pain: {
    content: { easy_ia: 3 },
    manual: { easy_microsoft: 3 },
    team_tool: { easy_microsoft: 1, gen_ia_factory: 1 },
    ambitious: { gen_ia_factory: 2 },
  },
  work_location: {
    documents: { easy_ia: 2 },
    office_shared: { easy_microsoft: 2 },
    scattered_systems: { gen_ia_factory: 2 },
    unsure: { generic: 1 },
  },
  usage_scale: {
    me_occasional: { easy_ia: 1 },
    team_regular: { easy_microsoft: 2 },
    org_wide: { gen_ia_factory: 3 },
    one_off: { easy_ia: 1, external_tool: 1 },
  },
  specificity: {
    very_specific: { gen_ia_factory: 1, easy_ia: 1 },
    common: { external_tool: 3 },
    mixed: { generic: 1 },
    dunno: { generic: 1 },
  },
};

// mirror of scoring.ts
const PRIORITY = ["easy_ia", "easy_microsoft", "gen_ia_factory", "external_tool", "faq", "generic"];
const MIN_CONFIDENCE = 2;

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

// Replicates the engine's primary pick (enough for coherent demo data).
function primaryFrom(answers) {
  const scores = { easy_ia: 0, easy_microsoft: 0, gen_ia_factory: 0, external_tool: 0, faq: 0, generic: 0 };
  for (const [qid, aid] of Object.entries(answers)) {
    const w = WEIGHTS[qid]?.[aid] ?? {};
    for (const [cat, pts] of Object.entries(w)) scores[cat] += pts;
  }
  const ranked = Object.keys(scores).sort((a, b) =>
    scores[b] !== scores[a] ? scores[b] - scores[a] : PRIORITY.indexOf(a) - PRIORITY.indexOf(b),
  );
  let primary = ranked[0];
  if (scores[primary] <= MIN_CONFIDENCE && primary !== "generic" && primary !== "faq") {
    primary = "generic";
  }
  return primary;
}

let counter = 0;
const eid = () => `e_seed_${(counter++).toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

function mk(name, ts, lang, sessionId, props) {
  return { id: eid(), name, timestamp: ts.toISOString(), lang, sessionId, props };
}

function randomDate() {
  const now = Date.now();
  const past = now - DAYS * 24 * 3600 * 1000;
  const r = Math.pow(Math.random(), 0.6); // bias toward recent
  const d = new Date(past + r * (now - past));
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
  if (chance(0.1)) return events; // bounce on landing

  events.push(mk("guide.cta_clicked", step(), lang, sessionId, { from: pick(["hero", "how-it-works"]) }));
  events.push(mk("guide.journey_started", step(), lang, sessionId));

  const answers = {};
  const visitedPath = [];
  const view = (qid, answerId) => {
    events.push(mk("guide.question_viewed", step(), lang, sessionId, { questionId: qid }));
    events.push(mk("guide.answer_selected", step(), lang, sessionId, { questionId: qid, answerId }));
    answers[qid] = answerId;
    visitedPath.push(qid);
  };

  // Q1 maturity
  const maturity = weighted([["ready", 64], ["fuzzy", 18], ["exploring", 18]]);
  view("maturity", maturity);

  // Q2 main_pain (always)
  const pain = weighted([["content", 34], ["manual", 27], ["team_tool", 20], ["ambitious", 19]]);
  view("main_pain", pain);

  if (maturity !== "exploring") {
    // Q3 work_location (lightly correlated with the pain, for realism)
    const wl = weighted([
      ["documents", pain === "content" ? 50 : 22],
      ["office_shared", pain === "manual" ? 50 : 26],
      ["scattered_systems", pain === "ambitious" ? 45 : 16],
      ["unsure", 12],
    ]);
    view("work_location", wl);

    // Q4 usage_scale
    const scale = weighted([
      ["me_occasional", pain === "content" ? 38 : 22],
      ["team_regular", pain === "manual" ? 46 : 32],
      ["org_wide", pain === "ambitious" ? 48 : 16],
      ["one_off", 16],
    ]);
    view("usage_scale", scale);

    // Q5 specificity
    const spec = weighted([
      ["very_specific", 30],
      ["common", 24],
      ["mixed", 26],
      ["dunno", 20],
    ]);
    view("specificity", spec);
  }

  // abandon?
  if (chance(0.16)) {
    events.push(mk("guide.journey_abandoned", step(), lang, sessionId, { questionId: pick(visitedPath) }));
    return events;
  }

  const rec = primaryFrom(answers);
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

  if (chance(0.06)) {
    events.push(mk("app.language_switched", step(), lang, sessionId, { to: lang === "fr" ? "en" : "fr" }));
  }

  return events;
}

async function main() {
  const all = [];
  for (let i = 0; i < SESSIONS; i++) all.push(...buildSession());

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
