// =====================================================================
// APP CONFIG — single source of truth for editable, non-translated data:
// contacts, booking links, placeholders, brand and feature flags.
//
// ▸ Anything an admin might change without touching logic lives here.
// ▸ Placeholder keys requested in the brief are grouped under PLACEHOLDERS.
// =====================================================================

import type { BookingContact, Localized } from "./types";

export const BRAND = {
  appName: "KIABI AI Guide",
  team: "Innovation & IA Gen",
  colors: {
    navy: "#040037",
    white: "#FFFFFF",
    accent: "#006EFB",
    cyan: "#00C2FF",
  },
  /** Public stat we can proudly show on the landing page. */
  assistantsCreated: 50,
} as const;

// ---------------------------------------------------------------------
// Booking contacts (Easy IA + Easy Microsoft)
// Real booking URLs provided by the Innovation team.
// ---------------------------------------------------------------------
export const BOOKING: Record<string, BookingContact> = {
  gautier: {
    id: "gautier",
    name: "Gautier Masse",
    role: { fr: "Expert IA (Sfeir)", en: "AI Expert (Sfeir)" },
    availability: { fr: "Disponible le mercredi", en: "Available on Wednesdays" },
    description: {
      fr: "Créneaux d'accompagnement d'1 heure pour cadrer et créer votre assistant IA.",
      en: "1-hour guided sessions to shape and build your AI assistant.",
    },
    url: "https://bookings.cloud.microsoft/bookwithme/user/40e4bd4466274103910f3633688d3164%40partner.kiabi.com?anonymous&ismsaljsauthenabled",
    analyticsKey: "gautier",
    initials: "GM",
  },
  loic: {
    id: "loic",
    name: "Loïc Bontemps",
    role: { fr: "Digital LAB", en: "Digital LAB" },
    availability: { fr: "Disponible les autres jours", en: "Available the other days" },
    description: {
      fr: "Créneaux d'accompagnement d'1 heure pour concrétiser votre idée d'assistant IA.",
      en: "1-hour guided sessions to turn your AI assistant idea into reality.",
    },
    url: "https://bookings.cloud.microsoft/bookwithme/user/8671e304b95d41988d33930902e2dfd6%40kiabi.com/meetingtype/l1qKYDLXBUGpjjP5oHqLzA2?anonymous&ismsaljsauthenabled=true",
    analyticsKey: "loic",
    initials: "LB",
  },
  matthieu: {
    id: "matthieu",
    name: "Matthieu Servien",
    role: { fr: "Expert Microsoft & Power Platform", en: "Microsoft & Power Platform Expert" },
    availability: { fr: "Disponible le jeudi", en: "Available on Thursdays" },
    description: {
      fr: "Créneaux d'1 heure pour transformer votre besoin en solution Microsoft concrète.",
      en: "1-hour sessions to turn your need into a concrete Microsoft solution.",
    },
    url: "https://bookings.cloud.microsoft/bookwithme/user/157299b4bc124672870ffda78a0f3206%40partner.kiabi.com/meetingtype/EfRRZeddIUmu9H7eIxPXpQ2?anonymous&ismsaljsauthenabled",
    analyticsKey: "matthieu",
    initials: "MS",
  },
};

// ---------------------------------------------------------------------
// EDITABLE PLACEHOLDERS
// These are intentionally incomplete — fill in before production.
// The UI renders graceful "to be completed" states when a value is empty.
// ---------------------------------------------------------------------

export interface ContactPlaceholder {
  /** Display name; empty => placeholder state. */
  name: string;
  email: string;
  /** Optional booking / scheduling url. */
  url: string;
  note: Localized;
}

export const PLACEHOLDERS = {
  // GEN IA Factory owner (complex / custom dev needs)
  GEN_IA_FACTORY_CONTACT: {
    name: "Younes Ouamari",
    email: "", // TODO: add real email before production
    url: "",
    note: {
      fr: "Référent GEN IA Factory — pour les besoins complexes nécessitant du développement sur mesure.",
      en: "GEN IA Factory lead — for complex needs requiring custom development.",
    },
  } as ContactPlaceholder,

  // External tool / license purchase path
  JUSTINE_SANSON_CONTACT: {
    name: "Justine Sanson",
    email: "", // TODO: add real email before production
    url: "",
    note: {
      fr: "Référente achats outils & licences — pour l'acquisition d'une solution du marché.",
      en: "Tools & licenses purchasing lead — for acquiring a market solution.",
    },
  } as ContactPlaceholder,

  // Generic innovation contact (fuzzy / hybrid needs)
  GENERIC_INNOVATION_CONTACT: {
    name: "Équipe Innovation & IA Gen",
    email: "", // TODO: add real shared mailbox before production
    url: "",
    note: {
      fr: "Contact générique pour qualifier votre besoin avec un humain.",
      en: "Generic contact to qualify your need with a human.",
    },
  } as ContactPlaceholder,

  // FAQ / documentation resources
  FAQ_LINKS: [
    {
      label: { fr: "Découvrir Easy IA & IAK", en: "Discover Easy IA & IAK" },
      url: "", // TODO
    },
    {
      label: { fr: "Guide de préparation à un créneau", en: "Session preparation guide" },
      url: "", // TODO
    },
    {
      label: { fr: "Catalogue d'assistants existants", en: "Existing assistants catalogue" },
      url: "", // TODO
    },
  ] as { label: Localized; url: string }[],

  // Extra examples (appended to the curated examples on each result page)
  EASY_IA_EXTRA_EXAMPLES: [] as Localized[],
  EASY_MICROSOFT_EXTRA_EXAMPLES: [] as Localized[],
  GEN_IA_FACTORY_EXAMPLES: [
    { fr: "Outil interne sur mesure relié à plusieurs systèmes", en: "Custom internal tool wired to several systems" },
    { fr: "Produit data/IA avec logique métier avancée", en: "Data/AI product with advanced business logic" },
  ] as Localized[],
  EXTERNAL_TOOL_EXAMPLES: [
    { fr: "Solution SaaS déjà éprouvée sur le marché", en: "Proven off-the-shelf SaaS solution" },
    { fr: "Licence d'un outil spécialisé prêt à l'emploi", en: "License for a ready-to-use specialised tool" },
  ] as Localized[],
} as const;

// ---------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------
export const ADMIN = {
  // The email allowed in. Mirrored server-side via ADMIN_EMAIL env var.
  allowedEmail: "martin.delaporte@kiabi.com",
} as const;
