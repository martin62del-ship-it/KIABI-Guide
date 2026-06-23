import type { RecommendationId } from "@/lib/config/types";

/** URL slug <-> recommendation id mapping (stable, shareable URLs). */
export const ID_TO_SLUG: Record<RecommendationId, string> = {
  easy_ia: "easy-ia",
  easy_microsoft: "easy-microsoft",
  gen_ia_factory: "gen-ia-factory",
  external_tool: "external-tool",
  faq: "faq",
  generic: "generic",
};

export const SLUG_TO_ID: Record<string, RecommendationId> = Object.fromEntries(
  Object.entries(ID_TO_SLUG).map(([id, slug]) => [slug, id as RecommendationId]),
) as Record<string, RecommendationId>;

export const RESULT_STORAGE_KEY = "kiabi-ai-guide.result";
