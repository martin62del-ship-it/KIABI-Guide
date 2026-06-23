# KIABI AI Guide

> Internal orientation tool that helps KIABI employees find — in under a
> minute — the innovation / AI support service that best fits their need.

A polished, bilingual (🇫🇷 / 🇬🇧) guided experience: a striking landing page,
a short branching questionnaire, a transparent recommendation engine, six
premium result pages, and a lightweight admin back-office with analytics.

Built with **Next.js 14 · React · TypeScript · Tailwind CSS · Framer Motion ·
lucide-react**. The front-end is the star; the backend stays intentionally
lightweight and swappable.

---

## ✨ Quick start

```bash
npm install
npm run seed        # generate demo analytics (already committed; re-run anytime)
npm run dev         # http://localhost:3000

# production
npm run build && npm start
```

Then visit:
- `/` — landing page
- `/guide` — the questionnaire
- `/result/easy-ia` (and the other 5 result types)
- `/admin` — back-office (see **Admin access** below)

### Environment

Copy `.env.example` → `.env.local`. All values are read **server-side only**.

| Variable | Purpose | Default |
|---|---|---|
| `ADMIN_EMAIL` | Email allowed into the admin area | `martin.delaporte@kiabi.com` |
| `ADMIN_PASSWORD` | Admin password (server-checked) | *empty* → dev demo password `kiabi-demo` |
| `ADMIN_SESSION_SECRET` | HMAC secret signing the session cookie | change in production |

> In **development**, if `ADMIN_PASSWORD` is empty the demo password
> `kiabi-demo` is accepted so the dashboard can be previewed. In
> **production** you must set `ADMIN_PASSWORD` (or wire real SSO — see
> [Production hardening](#-production-hardening)). No secret ever reaches the client.

---

## 1 · Product concept

Most employees don't know whether their need belongs to **Easy IA**, **Easy
Microsoft**, the **GEN IA Factory**, an **external tool**, or just some
**documentation**. KIABI AI Guide turns that ambiguity into a 30-second,
reassuring, non-technical journey that ends on a clear next step — book a
session, contact a person, or read up first.

**Design intent:** premium, friendly, fast, KIABI-branded, innovation-oriented.
Simple logic, high visual expectation.

## 2 · Information architecture

```
Landing (/)
 └─ Guide (/guide)            ← branching questionnaire, session state
     └─ Result (/result/[type]) ← one of 6 outcomes, shareable URL
Admin (/admin)                ← login gate → dashboard
API (/api/*)                  ← analytics ingestion + admin auth/dashboard
```

## 3 · Screen map

| Screen | Route | Notes |
|---|---|---|
| Landing | `/` | Animated hero, orbit visual, service teasers, "how it works" |
| Questionnaire | `/guide` | One focused step at a time, progress, back, branching |
| Result · Easy IA | `/result/easy-ia` | **Two equal booking cards** (Gautier · Loïc) |
| Result · Easy Microsoft | `/result/easy-microsoft` | Matthieu card + "when MS beats IAK" |
| Result · GEN IA Factory | `/result/gen-ia-factory` | Younes contact (placeholder) |
| Result · External tool | `/result/external-tool` | Justine contact + buy-vs-build |
| Result · FAQ / Docs | `/result/faq` | Resource links + prep guidance |
| Result · Generic contact | `/result/generic` | Reassuring human-qualification path |
| Admin login | `/admin` | Secure-ready gate |
| Admin dashboard | `/admin` (authed) | KPIs, distribution, clicks, answers, config |

## 4 · Decision logic / scoring model

A **transparent, deterministic engine** — no black box.
Each answer adds points to one or more of the six categories. The engine
([`src/lib/engine/recommend.ts`](src/lib/engine/recommend.ts)):

1. **Accumulates** points per category and collects each answer's
   human-readable rationale (`because`).
2. **Ranks** categories by score, breaking ties via a configured `priority`.
3. **Low-confidence fallback** → if the top score ≤ `minConfidence`, routes to
   the **Generic innovation contact** (human qualification) instead of guessing.
4. **Ambiguity routing** (optional) → if the two strongest service categories
   are within `ambiguityGap`, prefer Generic.
5. **Secondary recommendation** → surfaced when the runner-up is within
   `secondaryGap` of the winner.
6. **Explains itself** → the result page shows *"Based on your answers…"* with
   the rationale snippets that drove the winning category.

All knobs live in [`src/lib/config/scoring.ts`](src/lib/config/scoring.ts) and
are fully editable. Scoring weights live next to each answer in
[`src/lib/config/questions.ts`](src/lib/config/questions.ts).

## 5 · Questionnaire structure

Up to **8 questions**, with branching that keeps the flow short
(*"just exploring"* ≈ 2 steps; full path ≈ 7):

1. `main_goal` — what's your main goal?
2. `microsoft_dependency` — does it rely on Microsoft? *(skipped when exploring)*
3. `microsoft_tools` — which MS capabilities? *(only if Microsoft matters; multi-select)*
4. `solution_shape` — assistant / workflow / app / custom / buy?
5. `complexity` — simple / medium / high?
6. `custom_dev` — custom development needed? *(only if not "simple")*
7. `market_tool` — could a market tool already solve it? *(skipped if already "buy")*
8. `readiness` — exploring, shaping, or ready for a 1-hour session?

Branching is expressed declaratively via each question's `showIf(answers)`
predicate, so it stays editable and testable.

## 6 · Visual design direction

- **Brand tokens:** navy `#040037`, accent blue `#006EFB`, cyan `#00C2FF`, white.
- **Typography:** Figtree (via `next/font`), strong hierarchy, balanced headings.
- **Surfaces:** soft light theme, glassmorphism, premium shadows & depth.
- **Motion:** aurora gradient blobs, a canvas particle field, an orbiting brand
  visual, page/step transitions, card hover lifts, shimmer on primary buttons,
  pulse rings echoing the KIABI marker. All **respect `prefers-reduced-motion`.**
- **Brand mark:** a tasteful *digital interpretation* of the KIABI rounded-square
  marker (not a pixel copy — the official logo is never distorted).

## 7 · Component list

`brand/Logo` (KiabiMark, KiabiLogo) · `ui/Button` (+LinkButton) · `ui/Card`
(+GlassCard) · `ui/Badge` · `ui/Icon` (lucide resolver) · `ui/Progress`
(StepProgress, Ring) · `ui/LanguageSwitcher` · `background/Aurora` ·
`background/Particles` · `chrome/TopBar` · `chrome/Footer` ·
`landing/Hero` · `landing/ServiceTeasers` · `landing/HowItWorks` ·
`guide/Questionnaire` · `guide/AnswerCard` · `result/ResultView` ·
`result/BookingCard` · `result/ContactCard` · `result/ResourceList` ·
`admin/AdminLogin` · `admin/AdminDashboard`.

## 8 · Data / config structure

Everything content-related is editable without touching logic:

| File | Edits |
|---|---|
| `src/lib/config/app.config.ts` | Brand, **booking contacts**, **placeholders** |
| `src/lib/config/questions.ts` | Questions, answers, **scoring weights**, branching |
| `src/lib/config/scoring.ts` | Engine thresholds |
| `src/lib/config/results.ts` | Result page copy (FR/EN) |
| `src/lib/config/translations.ts` | All UI strings (FR/EN) |
| `src/lib/config/types.ts` | Shared types |

**Editable placeholders** (grouped under `PLACEHOLDERS`, rendered as graceful
"to be completed" states in the UI and flagged in the admin):
`GEN_IA_FACTORY_CONTACT`, `JUSTINE_SANSON_CONTACT`, `GENERIC_INNOVATION_CONTACT`,
`FAQ_LINKS`, `EASY_IA_EXTRA_EXAMPLES`, `EASY_MICROSOFT_EXTRA_EXAMPLES`,
`GEN_IA_FACTORY_EXAMPLES`, `EXTERNAL_TOOL_EXAMPLES`.

## 9 · Analytics model

**Naming convention:** `<domain>.<action>` (e.g. `guide.answer_selected`).
**Event shape:** `{ id, name, timestamp, lang, sessionId, props? }`.

Tracked events: `landing.viewed`, `guide.cta_clicked`, `guide.question_viewed`,
`guide.answer_selected`, `guide.previous_clicked`, `guide.journey_started`,
`guide.journey_abandoned`, `guide.journey_completed`, `result.displayed`,
`result.booking_clicked`, `result.contact_clicked`, `result.faq_clicked`,
`app.language_switched`, `admin.login`, `admin.dashboard_viewed`.

- **Client:** [`src/lib/analytics/client.ts`](src/lib/analytics/client.ts) —
  `track()` + typed wrappers, `navigator.sendBeacon`, per-session id, never throws.
- **Schema:** [`src/lib/analytics/events.ts`](src/lib/analytics/events.ts).
- **Server store:** [`src/lib/analytics/store.ts`](src/lib/analytics/store.ts) —
  file-backed JSON with in-memory fallback + the `AnalyticsStore` adapter seam,
  plus all dashboard aggregation (filters: date range, language, recommendation).

## 10 · Admin architecture

- **Gate:** `/admin` is a server component reading an **HMAC-signed, httpOnly**
  session cookie; unauthenticated users see the login, authed users the dashboard.
- **Auth scaffold:** [`src/lib/auth/admin.ts`](src/lib/auth/admin.ts) — email
  allow-list + password check (env), timing-safe comparisons, signed tokens.
- **Dashboard:** totals (visits, sessions, journey starts/completions + rate),
  recommendation distribution, per-question answer counts, click breakdown
  (Gautier / Loïc / Matthieu / contacts / FAQ), **filters** by date range,
  language and recommendation, plus **content/config entry points** and a
  live **placeholder completeness** checklist.

## 11 · File / folder architecture

```
src/
├─ app/
│  ├─ layout.tsx                 Root layout (Figtree, LanguageProvider)
│  ├─ globals.css                Design-system base
│  ├─ page.tsx                   Landing
│  ├─ guide/page.tsx             Questionnaire
│  ├─ result/[type]/page.tsx     Result (SSG for all 6 slugs)
│  ├─ admin/page.tsx             Login gate → dashboard
│  └─ api/
│     ├─ analytics/route.ts      POST event ingestion
│     └─ admin/{login,logout,dashboard}/route.ts
├─ components/  brand · ui · background · chrome · landing · guide · result · admin
└─ lib/        config · engine · analytics · auth · i18n · utils
data/
├─ analytics.seed.json           Committed demo data
└─ analytics.runtime.json        Live events (gitignored)
scripts/seed-analytics.mjs       Demo-data generator
```

## 12 · Implementation

Fully implemented and verified: `npm run build` passes (all 6 result pages
prerendered), the journey runs end-to-end, analytics ingest and aggregate, and
the admin login → filtered dashboard flow works.

## 13 · Seed / demo content

`npm run seed` writes ~5k realistic events across ~90 days (320 sessions) so the
dashboard is credible immediately. Real copy (Easy IA / Easy Microsoft,
experts, examples, the 1-hour session framing) is grounded in KIABI's internal
communications. When no live events exist, the admin shows a **"Demo data"** badge.

## 14 · 🔒 Production hardening

This is a polished scaffold; before production:

- **Auth:** replace the password check with **real SSO / OIDC** (Azure AD /
  Entra ID, or NextAuth) so identity comes from KIABI's IdP. Keep
  `ADMIN_SESSION_SECRET` in a secret manager and rotate it. Add rate-limiting +
  audit logging on `/api/admin/login`.
- **Analytics storage:** swap the file store for a real DB by implementing the
  `AnalyticsStore` interface (e.g. Postgres/Prisma). The file store is great for
  preview but not for serverless/read-only or multi-instance deployments.
- **Fill placeholders:** complete the `PLACEHOLDERS` (emails, FAQ links, extra
  examples). The admin lists exactly which remain. Verify booking URLs.
- **Content workflow:** config is code today; if non-devs must edit, back the
  config with a CMS/DB behind a `ContentStore` adapter (same pattern as analytics).
- **Consent/PII:** sessionId is random and anonymous; review against internal
  data-privacy policy before rollout, add a consent notice if required.
- **i18n:** language is a client cookie/localStorage choice; add locale routing
  + SEO if ever exposed beyond the intranet.

---

<p align="center"><sub>Internal orientation tool · Innovation &amp; IA Gen · KIABI — La mode à petits prix</sub></p>
