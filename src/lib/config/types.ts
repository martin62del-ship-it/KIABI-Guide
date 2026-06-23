// =====================================================================
// Core domain types for KIABI AI Guide
// All user-facing content is bilingual via the `Localized<T>` helper.
// =====================================================================

export type Lang = "fr" | "en";

/** A value available in both supported languages. */
export type Localized<T = string> = Record<Lang, T>;

/** The six (and only six) recommendation outcomes. */
export type RecommendationId =
  | "easy_ia"
  | "easy_microsoft"
  | "gen_ia_factory"
  | "external_tool"
  | "faq"
  | "generic";

export type CategoryScores = Record<RecommendationId, number>;

/** One selectable answer inside a question. */
export interface AnswerOption {
  id: string;
  label: Localized;
  /** Short helper text shown under the label. */
  hint?: Localized;
  /** lucide-react icon name (resolved in the UI). */
  icon?: string;
  /** Points this answer contributes to one or more categories. */
  scores: Partial<CategoryScores>;
  /**
   * Human-readable rationale surfaced in the result explanation when this
   * answer contributed to the winning recommendation.
   */
  because?: Localized;
}

/** A single question / step in the guided flow. */
export interface Question {
  id: string;
  /** Small eyebrow label, e.g. "Step 2 · Your tools". */
  eyebrow?: Localized;
  title: Localized;
  subtitle?: Localized;
  /** When false, the user can advance without picking (rarely used). */
  required?: boolean;
  /** Allow selecting several answers. */
  multiple?: boolean;
  options: AnswerOption[];
  /**
   * Optional branching: only show this question if the predicate passes.
   * `answers` maps questionId -> selected answerId(s).
   */
  showIf?: (answers: Record<string, string[]>) => boolean;
}

/** A booking contact card (used on result pages). */
export interface BookingContact {
  id: string;
  name: string;
  role: Localized;
  availability: Localized;
  description: Localized;
  /** Booking / agenda URL. Empty string => rendered as elegant placeholder. */
  url: string;
  /** Analytics target key, e.g. "gautier". */
  analyticsKey: string;
  initials: string;
}

/** Full content for a single recommendation result page. */
export interface ResultContent {
  id: RecommendationId;
  /** Short tag used in chips / admin. */
  tag: Localized;
  title: Localized;
  /** One-line interpretation of the user's need. */
  interpretation: Localized;
  /** Why this recommendation fits the user. */
  why: Localized;
  /** What the service actually does. */
  whatItDoes: Localized;
  /** Bullet examples / representative use cases. */
  examples: Localized<string[]>;
  /** Optional extra explanation block (e.g. buy-vs-build, MS vs IAK). */
  note?: Localized;
  /** Accent color token used to theme the page. */
  accent: "brand" | "violet" | "amber" | "emerald" | "slate" | "navy";
  icon: string;
}
