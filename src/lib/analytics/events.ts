// =====================================================================
// ANALYTICS SCHEMA — naming convention + event taxonomy.
//
// Convention:  <domain>.<action>   (snake domain, snake action)
//   landing.viewed, guide.cta_clicked, guide.answer_selected, …
//
// Every event carries: { name, timestamp, lang, sessionId, props? }.
// `props` is a small, typed bag (questionId, recommendation, linkType…).
// =====================================================================

import type { Lang, RecommendationId } from "@/lib/config/types";

export const EVENTS = {
  LANDING_VIEWED: "landing.viewed",
  CTA_CLICKED: "guide.cta_clicked",
  QUESTION_VIEWED: "guide.question_viewed",
  ANSWER_SELECTED: "guide.answer_selected",
  PREVIOUS_CLICKED: "guide.previous_clicked",
  JOURNEY_STARTED: "guide.journey_started",
  JOURNEY_ABANDONED: "guide.journey_abandoned",
  JOURNEY_COMPLETED: "guide.journey_completed",
  RESULT_DISPLAYED: "result.displayed",
  BOOKING_CLICKED: "result.booking_clicked",
  CONTACT_CLICKED: "result.contact_clicked",
  FAQ_CLICKED: "result.faq_clicked",
  LANGUAGE_SWITCHED: "app.language_switched",
  ADMIN_LOGIN: "admin.login",
  ADMIN_DASHBOARD_VIEWED: "admin.dashboard_viewed",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/** Categories of clickable links we track, for the admin breakdown. */
export type LinkType = "booking" | "contact" | "faq" | "resource";

export interface EventProps {
  questionId?: string;
  answerId?: string;
  recommendation?: RecommendationId;
  secondary?: RecommendationId;
  /** Target key for a click: gautier | loic | matthieu | younes | justine | generic | faq:<n> */
  target?: string;
  linkType?: LinkType;
  /** Free-form extra context. */
  [key: string]: unknown;
}

export interface AnalyticsEvent {
  id: string;
  name: EventName;
  timestamp: string; // ISO 8601
  lang: Lang;
  sessionId: string;
  props?: EventProps;
}

/** Human-readable labels for events (used in the admin UI if needed). */
export const EVENT_LABELS: Record<EventName, { fr: string; en: string }> = {
  [EVENTS.LANDING_VIEWED]: { fr: "Page d'accueil vue", en: "Landing viewed" },
  [EVENTS.CTA_CLICKED]: { fr: "CTA principal cliqué", en: "Main CTA clicked" },
  [EVENTS.QUESTION_VIEWED]: { fr: "Question affichée", en: "Question viewed" },
  [EVENTS.ANSWER_SELECTED]: { fr: "Réponse sélectionnée", en: "Answer selected" },
  [EVENTS.PREVIOUS_CLICKED]: { fr: "Retour cliqué", en: "Previous clicked" },
  [EVENTS.JOURNEY_STARTED]: { fr: "Parcours démarré", en: "Journey started" },
  [EVENTS.JOURNEY_ABANDONED]: { fr: "Parcours abandonné", en: "Journey abandoned" },
  [EVENTS.JOURNEY_COMPLETED]: { fr: "Parcours terminé", en: "Journey completed" },
  [EVENTS.RESULT_DISPLAYED]: { fr: "Résultat affiché", en: "Result displayed" },
  [EVENTS.BOOKING_CLICKED]: { fr: "Lien agenda cliqué", en: "Booking link clicked" },
  [EVENTS.CONTACT_CLICKED]: { fr: "Lien contact cliqué", en: "Contact link clicked" },
  [EVENTS.FAQ_CLICKED]: { fr: "Lien FAQ cliqué", en: "FAQ link clicked" },
  [EVENTS.LANGUAGE_SWITCHED]: { fr: "Langue changée", en: "Language switched" },
  [EVENTS.ADMIN_LOGIN]: { fr: "Connexion admin", en: "Admin login" },
  [EVENTS.ADMIN_DASHBOARD_VIEWED]: { fr: "Dashboard admin vu", en: "Admin dashboard viewed" },
};
