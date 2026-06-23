"use client";

// =====================================================================
// ANALYTICS CLIENT — tiny, reusable tracking utility used everywhere.
//
// ▸ track(name, props) posts a beacon to /api/analytics (fire-and-forget).
// ▸ A stable per-browser sessionId is kept in sessionStorage.
// ▸ Reads the current language from the persisted cookie/localStorage.
// ▸ Never throws into UI code — analytics must never break the experience.
// =====================================================================

import { EVENTS, type EventName, type EventProps, type LinkType } from "./events";
import type { Lang, RecommendationId } from "@/lib/config/types";

const SESSION_KEY = "kiabi-ai-guide.session";
const LANG_KEY = "kiabi-ai-guide.lang";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getLang(): Lang {
  if (typeof window === "undefined") return "fr";
  const fromStorage = window.localStorage.getItem(LANG_KEY);
  return fromStorage === "en" ? "en" : "fr";
}

/** Core tracker. Fire-and-forget; resilient to failures. */
export function track(name: EventName, props?: EventProps): void {
  if (typeof window === "undefined") return;
  const payload = {
    name,
    props,
    lang: getLang(),
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
  };
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* swallow — analytics must never break UX */
  }
}

// ---- Convenience wrappers (self-documenting call sites) --------------

export const trackLandingViewed = () => track(EVENTS.LANDING_VIEWED);
export const trackCtaClicked = (from = "landing") => track(EVENTS.CTA_CLICKED, { from });
export const trackQuestionViewed = (questionId: string, index: number) =>
  track(EVENTS.QUESTION_VIEWED, { questionId, index });
export const trackAnswerSelected = (questionId: string, answerId: string) =>
  track(EVENTS.ANSWER_SELECTED, { questionId, answerId });
export const trackPreviousClicked = (questionId: string) =>
  track(EVENTS.PREVIOUS_CLICKED, { questionId });
export const trackJourneyStarted = () => track(EVENTS.JOURNEY_STARTED);
export const trackJourneyAbandoned = (questionId?: string) =>
  track(EVENTS.JOURNEY_ABANDONED, { questionId });
export const trackJourneyCompleted = (recommendation: RecommendationId) =>
  track(EVENTS.JOURNEY_COMPLETED, { recommendation });
export const trackResultDisplayed = (
  recommendation: RecommendationId,
  secondary?: RecommendationId,
) => track(EVENTS.RESULT_DISPLAYED, { recommendation, secondary });
export const trackBookingClicked = (target: string) =>
  track(EVENTS.BOOKING_CLICKED, { target, linkType: "booking" as LinkType });
export const trackContactClicked = (target: string) =>
  track(EVENTS.CONTACT_CLICKED, { target, linkType: "contact" as LinkType });
export const trackFaqClicked = (target: string) =>
  track(EVENTS.FAQ_CLICKED, { target, linkType: "faq" as LinkType });
export const trackLanguageSwitch = (lang: Lang) =>
  track(EVENTS.LANGUAGE_SWITCHED, { to: lang });
export const trackAdminDashboardViewed = () => track(EVENTS.ADMIN_DASHBOARD_VIEWED);
