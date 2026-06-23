// =====================================================================
// SCORING RULES — editable knobs for the recommendation engine.
// Keep logic transparent: tweak thresholds here, never hard-code in UI.
// =====================================================================

import type { RecommendationId } from "./types";

export const SCORING = {
  /**
   * Order used as a deterministic tie-breaker when two categories are
   * perfectly equal (earlier = preferred). Action-oriented services first.
   */
  priority: [
    "easy_ia",
    "easy_microsoft",
    "gen_ia_factory",
    "external_tool",
    "faq",
    "generic",
  ] as RecommendationId[],

  /**
   * If the winning score is at or below this, the need is too weak/fuzzy
   * to route confidently → fall back to the generic innovation contact.
   */
  minConfidence: 2,

  /**
   * Show a secondary recommendation when the runner-up is within this many
   * points of the winner (and is a different, meaningful category).
   */
  secondaryGap: 1,

  /**
   * If the top two *distinct service* categories are within this gap AND
   * neither clearly leads, prefer a human qualification step (generic).
   * Set to 0 to disable ambiguity routing.
   */
  ambiguityGap: 0,
} as const;
