// =====================================================================
// RECOMMENDATION ENGINE — transparent, deterministic, no black box.
//
// Input  : the user's selected answers (questionId -> answerId[])
// Output : primary (+ optional secondary) recommendation, full score
//          breakdown, and a list of human-readable reasons.
// =====================================================================

import { QUESTIONS } from "@/lib/config/questions";
import { SCORING } from "@/lib/config/scoring";
import type {
  AnswerOption,
  CategoryScores,
  Lang,
  Localized,
  RecommendationId,
} from "@/lib/config/types";

export type AnswersMap = Record<string, string[]>;

export interface RecommendationResult {
  primary: RecommendationId;
  secondary?: RecommendationId;
  scores: CategoryScores;
  /** Ordered, de-duplicated rationale strings for the winning category. */
  reasons: Localized[];
  /** True when we fell back to the generic contact for lack of confidence. */
  lowConfidence: boolean;
}

const EMPTY_SCORES: CategoryScores = {
  easy_ia: 0,
  easy_microsoft: 0,
  gen_ia_factory: 0,
  external_tool: 0,
  faq: 0,
  generic: 0,
};

/** Flatten config into a lookup of every answer option by id. */
function buildAnswerIndex(): Map<string, AnswerOption> {
  const index = new Map<string, AnswerOption>();
  for (const q of QUESTIONS) {
    for (const opt of q.options) index.set(`${q.id}:${opt.id}`, opt);
  }
  return index;
}

/** Returns the questions that are actually visible given current answers. */
export function visibleQuestions(answers: AnswersMap) {
  return QUESTIONS.filter((q) => (q.showIf ? q.showIf(answers) : true));
}

/** Core scoring + decision. Pure function — easy to unit test. */
export function recommend(answers: AnswersMap): RecommendationResult {
  const index = buildAnswerIndex();
  const scores: CategoryScores = { ...EMPTY_SCORES };
  const reasonsByCategory = new Map<RecommendationId, Localized[]>();

  // 1) Accumulate points + collect rationale per category.
  for (const [questionId, answerIds] of Object.entries(answers)) {
    for (const answerId of answerIds) {
      const opt = index.get(`${questionId}:${answerId}`);
      if (!opt) continue;
      for (const [cat, pts] of Object.entries(opt.scores) as [RecommendationId, number][]) {
        scores[cat] += pts ?? 0;
        if (opt.because) {
          const list = reasonsByCategory.get(cat) ?? [];
          list.push(opt.because);
          reasonsByCategory.set(cat, list);
        }
      }
    }
  }

  // 2) Rank categories: by score desc, then by configured priority.
  const ranked = (Object.keys(scores) as RecommendationId[]).sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return SCORING.priority.indexOf(a) - SCORING.priority.indexOf(b);
  });

  let primary = ranked[0];
  const topScore = scores[primary];

  // 3) Low-confidence fallback → generic human qualification.
  let lowConfidence = false;
  if (topScore <= SCORING.minConfidence && primary !== "generic") {
    // Only override service routing, not an explicit FAQ/explore signal.
    if (primary !== "faq") {
      lowConfidence = true;
      primary = "generic";
    }
  }

  // 4) Ambiguity routing between the two strongest *service* categories.
  const serviceCats: RecommendationId[] = [
    "easy_ia",
    "easy_microsoft",
    "gen_ia_factory",
    "external_tool",
  ];
  if (
    SCORING.ambiguityGap > 0 &&
    serviceCats.includes(primary) &&
    !lowConfidence
  ) {
    const rankedServices = serviceCats
      .slice()
      .sort((a, b) => scores[b] - scores[a]);
    const [first, second] = rankedServices;
    if (
      scores[first] > 0 &&
      scores[first] - scores[second] <= SCORING.ambiguityGap
    ) {
      primary = "generic";
    }
  }

  // 5) Secondary recommendation if a different category is close behind.
  let secondary: RecommendationId | undefined;
  for (const cat of ranked) {
    if (cat === primary) continue;
    if (scores[cat] <= 0) break;
    if (scores[primary] - scores[cat] <= SCORING.secondaryGap) {
      secondary = cat;
    }
    break; // only consider the immediate runner-up
  }

  // 6) Reasons for the winning category (fallback to a generic explanation).
  const reasons = (reasonsByCategory.get(primary) ?? []).slice(0, 3);

  return { primary, secondary, scores, reasons, lowConfidence };
}

/** Convenience: top-scoring answer-driven highlight for analytics/debug. */
export function dominantScore(scores: CategoryScores): number {
  return Math.max(...(Object.values(scores) as number[]));
}

/** Localise a `Localized` value. */
export function pick<T>(value: Record<Lang, T>, lang: Lang): T {
  return value[lang];
}
