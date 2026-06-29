// =====================================================================
// UI TRANSLATIONS — every non-content string used across the interface.
// Content (questions, results) lives in its own config files.
// Edit freely; both FR and EN must stay in sync.
// =====================================================================

import type { Lang } from "./types";

export const DICT = {
  nav: {
    guide: { fr: "Le guide", en: "The guide" },
    services: { fr: "Les services", en: "Services" },
    admin: { fr: "Admin", en: "Admin" },
    start: { fr: "Trouver ma solution", en: "Find my solution" },
  },
  landing: {
    eyebrow: { fr: "Innovation & IA Gen", en: "Innovation & IA Gen" },
    title1: { fr: "Trouvez le bon", en: "Find the right" },
    titleHighlight: { fr: "accompagnement IA", en: "AI support" },
    title2: { fr: "en moins d'une minute.", en: "in under a minute." },
    subtitle: {
      fr: "KIABI AI Guide vous oriente vers le dispositif d'innovation le plus adapté à votre besoin — Easy IA, Easy Microsoft, GEN IA Factory et plus encore.",
      en: "KIABI AI Guide points you to the innovation service that best fits your need — Easy IA, Easy Microsoft, GEN IA Factory and more.",
    },
    primaryCta: { fr: "Trouver ma solution", en: "Find my solution" },
    secondaryCta: { fr: "Voir les dispositifs", en: "See the services" },
    secondaryMessage: {
      fr: "Un besoin, une bonne porte. Répondez à quelques questions, on s'occupe du reste.",
      en: "One need, one right door. Answer a few questions, we handle the rest.",
    },
    stat1Value: { fr: "50+", en: "50+" },
    stat1Label: { fr: "assistants déjà créés", en: "assistants already built" },
    stat2Value: { fr: "1 h", en: "1 hr" },
    stat2Label: { fr: "pour passer à l'action", en: "to take action" },
    stat3Value: { fr: "6", en: "6" },
    stat3Label: { fr: "chemins d'accompagnement", en: "support paths" },
    teaserTitle: { fr: "Un écosystème de dispositifs", en: "An ecosystem of services" },
    teaserSubtitle: {
      fr: "Le guide vous oriente vers celui qui correspond à votre besoin.",
      en: "The guide routes you to the one that matches your need.",
    },
    howTitle: { fr: "Comment ça marche", en: "How it works" },
    step1Title: { fr: "Décrivez votre besoin", en: "Describe your need" },
    step1Text: {
      fr: "Quelques questions simples, sans jargon.",
      en: "A few simple, jargon-free questions.",
    },
    step2Title: { fr: "On analyse", en: "We analyse" },
    step2Text: {
      fr: "Un moteur transparent pondère vos réponses.",
      en: "A transparent engine weighs your answers.",
    },
    step3Title: { fr: "Vous êtes orienté", en: "You're guided" },
    step3Text: {
      fr: "La bonne porte, et quoi faire ensuite.",
      en: "The right door, and what to do next.",
    },
  },
  services: {
    easy_ia: {
      name: { fr: "Easy IA", en: "Easy IA" },
      tagline: {
        fr: "Créez un assistant IA pour un besoin métier concret.",
        en: "Build an AI assistant for a concrete business need.",
      },
    },
    easy_microsoft: {
      name: { fr: "Easy Microsoft", en: "Easy Microsoft" },
      tagline: {
        fr: "Automatisez et exploitez l'écosystème Microsoft.",
        en: "Automate and harness the Microsoft ecosystem.",
      },
    },
    gen_ia_factory: {
      name: { fr: "GEN IA Factory", en: "GEN IA Factory" },
      tagline: {
        fr: "Construisez un produit sur mesure avec une équipe.",
        en: "Build a custom product with a team.",
      },
    },
    external_tool: {
      name: { fr: "Outil du marché", en: "Market tool" },
      tagline: {
        fr: "Adoptez une solution existante, vite et bien.",
        en: "Adopt an existing solution, fast and well.",
      },
    },
  },
  guide: {
    progress: { fr: "Étape", en: "Step" },
    of: { fr: "sur", en: "of" },
    back: { fr: "Retour", en: "Back" },
    next: { fr: "Continuer", en: "Continue" },
    seeResult: { fr: "Voir ma recommandation", en: "See my recommendation" },
    skip: { fr: "Passer", en: "Skip" },
    selectHint: { fr: "Sélectionnez une réponse", en: "Select an answer" },
    selectMultiHint: { fr: "Plusieurs choix possibles", en: "Select all that apply" },
    quit: { fr: "Quitter", en: "Quit" },
    quitConfirm: {
      fr: "Quitter le guide ? Votre progression sera perdue.",
      en: "Quit the guide? Your progress will be lost.",
    },
  },
  result: {
    eyebrow: { fr: "Votre recommandation", en: "Your recommendation" },
    interpretationLabel: { fr: "Votre besoin", en: "Your need" },
    whyLabel: { fr: "Pourquoi ce choix", en: "Why this fits" },
    whatLabel: { fr: "Ce que fait ce dispositif", en: "What this service does" },
    examplesLabel: { fr: "Quelques exemples", en: "A few examples" },
    becauseLabel: { fr: "D'après vos réponses", en: "Based on your answers" },
    actLabel: { fr: "Passer à l'action", en: "Take action now" },
    secondaryLabel: { fr: "Autre piste pertinente", en: "Another relevant path" },
    secondaryIntro: {
      fr: "Votre besoin touche aussi à :",
      en: "Your need also touches on:",
    },
    seeSecondary: { fr: "Découvrir", en: "Explore" },
    restart: { fr: "Recommencer le guide", en: "Restart the guide" },
    bookSession: { fr: "Réserver un créneau", en: "Book a session" },
    book: { fr: "Réserver", en: "Book" },
    bothVisible: {
      fr: "Deux experts, à vous de choisir le créneau qui vous arrange.",
      en: "Two experts — pick whichever slot suits you.",
    },
    contact: { fr: "Contacter", en: "Contact" },
    contactVia: { fr: "Prendre contact", en: "Get in touch" },
    sessionDuration: { fr: "Créneau d'1 heure", en: "1-hour session" },
    placeholderContact: {
      fr: "Coordonnées à compléter — contactez l'équipe Innovation en attendant.",
      en: "Contact details to be completed — reach the Innovation team meanwhile.",
    },
    placeholderLink: { fr: "Lien à compléter", en: "Link to be added" },
    resources: { fr: "Ressources", en: "Resources" },
    openResource: { fr: "Ouvrir", en: "Open" },
    noResult: {
      fr: "Aucune recommandation en mémoire. Lancez le guide pour obtenir la vôtre.",
      en: "No recommendation in memory. Start the guide to get yours.",
    },
    startGuide: { fr: "Lancer le guide", en: "Start the guide" },
    copyLink: { fr: "Copier le lien", en: "Copy link" },
    copyEmail: { fr: "Copier l'e-mail", en: "Copy email" },
    copied: { fr: "Copié !", en: "Copied!" },
  },
  admin: {
    loginTitle: { fr: "Espace administration", en: "Admin area" },
    loginSubtitle: {
      fr: "Réservé à l'équipe Innovation & IA Gen.",
      en: "Reserved for the Innovation & IA Gen team.",
    },
    email: { fr: "Adresse e-mail", en: "Email address" },
    password: { fr: "Mot de passe", en: "Password" },
    login: { fr: "Se connecter", en: "Sign in" },
    logout: { fr: "Déconnexion", en: "Sign out" },
    loginError: { fr: "Identifiants invalides.", en: "Invalid credentials." },
    demoHint: {
      fr: "Démo : mot de passe « kiabi-demo » (à remplacer en production).",
      en: "Demo: password \"kiabi-demo\" (replace in production).",
    },
    dashboard: { fr: "Tableau de bord", en: "Dashboard" },
    overview: { fr: "Vue d'ensemble", en: "Overview" },
    visits: { fr: "Visites", en: "Visits" },
    sessions: { fr: "Sessions", en: "Sessions" },
    starts: { fr: "Parcours démarrés", en: "Journeys started" },
    completions: { fr: "Parcours terminés", en: "Journeys completed" },
    completionRate: { fr: "Taux de complétion", en: "Completion rate" },
    distribution: { fr: "Répartition des recommandations", en: "Recommendation distribution" },
    answersBreakdown: { fr: "Réponses par question", en: "Answers per question" },
    clicks: { fr: "Clics sur les liens", en: "Link clicks" },
    bookingClicks: { fr: "Clics agendas", en: "Agenda clicks" },
    contactClicks: { fr: "Clics contacts", en: "Contact clicks" },
    faqClicks: { fr: "Clics FAQ", en: "FAQ clicks" },
    filters: { fr: "Filtres", en: "Filters" },
    dateRange: { fr: "Période", en: "Date range" },
    language: { fr: "Langue", en: "Language" },
    allLanguages: { fr: "Toutes", en: "All" },
    recommendation: { fr: "Recommandation", en: "Recommendation" },
    allRecommendations: { fr: "Toutes", en: "All" },
    last7: { fr: "7 derniers jours", en: "Last 7 days" },
    last30: { fr: "30 derniers jours", en: "Last 30 days" },
    last90: { fr: "90 derniers jours", en: "Last 90 days" },
    allTime: { fr: "Tout l'historique", en: "All time" },
    content: { fr: "Contenu & configuration", en: "Content & configuration" },
    contentIntro: {
      fr: "Points d'entrée pour éditer le contenu (scaffold — à brancher en production).",
      en: "Entry points to edit content (scaffold — wire up in production).",
    },
    editQuestions: { fr: "Questions du guide", en: "Guide questions" },
    editResults: { fr: "Contenu des résultats", en: "Results content" },
    editContacts: { fr: "Contacts & liens", en: "Contacts & links" },
    editScoring: { fr: "Règles de scoring", en: "Scoring rules" },
    editTranslations: { fr: "Traductions", en: "Translations" },
    configFile: { fr: "Fichier", en: "File" },
    placeholdersTitle: { fr: "Placeholders à compléter", en: "Placeholders to complete" },
    placeholdersIntro: {
      fr: "Ces valeurs sont volontairement vides et doivent être renseignées.",
      en: "These values are intentionally empty and must be filled in.",
    },
    missing: { fr: "À compléter", en: "To complete" },
    set: { fr: "Renseigné", en: "Set" },
    noData: { fr: "Pas encore de données sur cette période.", en: "No data for this period yet." },
    topAnswer: { fr: "Réponse dominante", en: "Top answer" },
    events: { fr: "événements", en: "events" },
    demoBadge: { fr: "Données de démonstration", en: "Demo data" },
  },
  common: {
    appName: { fr: "KIABI AI Guide", en: "KIABI AI Guide" },
    tagline: { fr: "La mode à petits prix", en: "La mode à petits prix" },
    by: { fr: "par l'équipe", en: "by the" },
    team: { fr: "Innovation & IA Gen", en: "Innovation & IA Gen team" },
    loading: { fr: "Chargement…", en: "Loading…" },
    backHome: { fr: "Accueil", en: "Home" },
    langFr: { fr: "FR", en: "FR" },
    langEn: { fr: "EN", en: "EN" },
    footerNote: {
      fr: "Outil interne d'orientation — Innovation & IA Gen.",
      en: "Internal orientation tool — Innovation & IA Gen.",
    },
  },
} as const;

// ---------------------------------------------------------------------
// Tiny helper to read a nested localized string by dotted path.
// Usage: t("landing.title1", lang)
// ---------------------------------------------------------------------
type Dict = typeof DICT;

export function tPath(path: string, lang: Lang): string {
  const parts = path.split(".");
  let node: unknown = DICT;
  for (const p of parts) {
    if (node && typeof node === "object" && p in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[p];
    } else {
      return path; // fail visibly during development
    }
  }
  if (node && typeof node === "object" && lang in (node as Record<string, unknown>)) {
    return (node as Record<Lang, string>)[lang];
  }
  return path;
}

export type { Dict };
