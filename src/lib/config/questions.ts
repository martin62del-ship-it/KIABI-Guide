// =====================================================================
// QUESTIONS — the guided flow. Fully editable.
//
// PRINCIPLE: we ask about the employee's NEED and lived CONTEXT, never the
// solution. No question or answer label names a service (Easy IA, Easy
// Microsoft, Gen IA Factory…) or a routing technology (SharePoint, Power
// Automate, "AI assistant", "custom development"…). The invisible scoring
// engine translates these answers into a recommended service.
//
// ▸ Each answer adds points to one or more recommendation categories.
// ▸ `showIf` enables lightweight branching (keeps the flow short).
// ▸ `because` is the human-readable rationale surfaced on the result page —
//   always phrased in the employee's NEED language, never naming a service.
//
// Branching summary ("just exploring" ≈ 2 steps, full path = 5 steps):
//   Q1 maturity        ── always
//   Q2 main_pain        ── always
//   Q3 work_location    ── hidden when "just exploring"
//   Q4 usage_scale      ── hidden when "just exploring"
//   Q5 specificity      ── hidden when "just exploring"
// =====================================================================

import type { Question } from "./types";

const isExploring = (a: Record<string, string[]>) =>
  (a.maturity ?? []).includes("exploring");

export const QUESTIONS: Question[] = [
  {
    id: "maturity",
    eyebrow: { fr: "Votre démarche", en: "Your stage" },
    title: { fr: "Où en êtes-vous avec ce besoin ?", en: "Where are you with this need?" },
    subtitle: {
      fr: "Pas de mauvaise réponse — dites-nous simplement à quel stade vous en êtes.",
      en: "No wrong answer — just tell us what stage you're at.",
    },
    required: true,
    options: [
      {
        id: "ready",
        icon: "Rocket",
        label: {
          fr: "J'ai un besoin concret et j'aimerais avancer dessus bientôt",
          en: "I have a concrete need and want to move on it soon",
        },
        // Neutral on purpose: routing is driven by Q2–Q5.
        scores: {},
      },
      {
        id: "fuzzy",
        icon: "PencilRuler",
        label: {
          fr: "J'ai une idée, mais elle est encore floue à cadrer",
          en: "I have an idea, but it's still fuzzy and needs shaping",
        },
        scores: { generic: 2 },
        because: {
          fr: "Votre besoin mérite d'être clarifié avec un interlocuteur avant d'aller plus loin.",
          en: "Your need would benefit from being clarified with someone before going further.",
        },
      },
      {
        id: "exploring",
        icon: "Compass",
        label: {
          fr: "Je me renseigne, je veux surtout voir ce qui est possible",
          en: "I'm just looking around, mainly to see what's possible",
        },
        scores: { faq: 4 },
        because: {
          fr: "Vous êtes en phase de découverte : autant explorer les possibilités d'abord.",
          en: "You're in discovery mode: best to explore the possibilities first.",
        },
      },
    ],
  },

  {
    id: "main_pain",
    eyebrow: { fr: "Votre quotidien", en: "Your day-to-day" },
    title: { fr: "Qu'est-ce qui vous pèse le plus aujourd'hui ?", en: "What weighs on you most today?" },
    subtitle: {
      fr: "Choisissez ce qui ressemble le plus à votre situation.",
      en: "Pick what most resembles your situation.",
    },
    required: true,
    options: [
      {
        id: "content",
        icon: "Feather",
        label: {
          fr: "Je passe trop de temps à écrire, résumer, traduire ou retrouver de l'information",
          en: "I spend too much time writing, summarising, translating or finding information",
        },
        scores: { easy_ia: 3 },
        because: {
          fr: "Vous passez beaucoup de temps sur de l'écrit, de la traduction et de la recherche d'information.",
          en: "You spend a lot of time on writing, translation and finding information.",
        },
      },
      {
        id: "manual",
        icon: "Workflow",
        label: {
          fr: "Je refais sans cesse les mêmes manipulations à la main (ressaisir, recopier, compiler, relancer)",
          en: "I keep redoing the same manual steps by hand (re-entering, copying, compiling, chasing)",
        },
        scores: { easy_microsoft: 3 },
        because: {
          fr: "Vous répétez souvent les mêmes manipulations à la main, ce qui peut être automatisé.",
          en: "You often repeat the same manual steps by hand — something that can be automated.",
        },
      },
      {
        id: "team_tool",
        icon: "Users",
        label: {
          fr: "Mon équipe manque d'un outil commun pour travailler ou suivre son activité",
          en: "My team lacks a shared tool to work or track its activity",
        },
        scores: { easy_microsoft: 1, gen_ia_factory: 1 },
        because: {
          fr: "Votre équipe gagnerait à disposer d'un outil commun pour travailler ou se suivre.",
          en: "Your team would benefit from a shared tool to work or keep track.",
        },
      },
      {
        id: "ambitious",
        icon: "Sparkles",
        label: {
          fr: "Je veux mettre en place quelque chose de nouveau et ambitieux, qui n'existe pas encore chez nous",
          en: "I want to set up something new and ambitious that doesn't exist here yet",
        },
        scores: { gen_ia_factory: 2 },
        because: {
          fr: "Vous portez un projet nouveau et ambitieux, qui va au-delà d'un coup de pouce ponctuel.",
          en: "You're driving a new, ambitious project that goes beyond a quick fix.",
        },
      },
    ],
  },

  {
    id: "work_location",
    eyebrow: { fr: "Votre contexte", en: "Your context" },
    title: {
      fr: "Où vivent surtout vos informations et votre travail aujourd'hui ?",
      en: "Where do your information and work mostly live today?",
    },
    required: true,
    showIf: (a) => !isExploring(a),
    options: [
      {
        id: "documents",
        icon: "BookOpen",
        label: {
          fr: "Dans des documents, des textes, des connaissances à exploiter",
          en: "In documents, text and knowledge to draw on",
        },
        scores: { easy_ia: 2 },
        because: {
          fr: "Votre travail s'appuie surtout sur des documents et des connaissances à exploiter.",
          en: "Your work mainly relies on documents and knowledge to draw on.",
        },
      },
      {
        id: "office_shared",
        icon: "FolderTree",
        label: {
          fr: "Dans des fichiers, des mails et des espaces partagés que j'utilise tous les jours",
          en: "In files, emails and shared spaces I use every day",
        },
        scores: { easy_microsoft: 2 },
        because: {
          fr: "Votre travail vit dans des fichiers, mails et espaces partagés du quotidien.",
          en: "Your work lives in everyday files, emails and shared spaces.",
        },
      },
      {
        id: "scattered_systems",
        icon: "Network",
        label: {
          fr: "Réparti dans plusieurs logiciels internes qui ne se parlent pas",
          en: "Spread across several internal systems that don't talk to each other",
        },
        scores: { gen_ia_factory: 2 },
        because: {
          fr: "Vos informations sont éparpillées dans plusieurs logiciels qui ne communiquent pas.",
          en: "Your information is scattered across several systems that don't communicate.",
        },
      },
      {
        id: "unsure",
        icon: "HelpCircle",
        label: { fr: "Honnêtement, je ne sais pas trop", en: "Honestly, I'm not really sure" },
        scores: { generic: 1 },
      },
    ],
  },

  {
    id: "usage_scale",
    eyebrow: { fr: "L'usage", en: "The usage" },
    title: {
      fr: "Le résultat servira surtout à qui, et à quelle fréquence ?",
      en: "Who will the result mainly serve, and how often?",
    },
    required: true,
    showIf: (a) => !isExploring(a),
    options: [
      {
        id: "me_occasional",
        icon: "Feather",
        label: { fr: "Surtout à moi, de temps en temps", en: "Mainly me, every now and then" },
        scores: { easy_ia: 1 },
        because: {
          fr: "C'est avant tout un besoin individuel et ponctuel.",
          en: "It's above all an individual, occasional need.",
        },
      },
      {
        id: "team_regular",
        icon: "Users",
        label: { fr: "À moi ou mon équipe, de façon régulière", en: "Me or my team, on a regular basis" },
        scores: { easy_microsoft: 2 },
        because: {
          fr: "Le résultat servira régulièrement à toute une équipe.",
          en: "The result will serve a whole team on a regular basis.",
        },
      },
      {
        id: "org_wide",
        icon: "Layers",
        label: {
          fr: "À toute une organisation, comme un outil sur lequel on s'appuie vraiment",
          en: "A whole organisation, as a tool people genuinely rely on",
        },
        scores: { gen_ia_factory: 3 },
        because: {
          fr: "Le résultat doit servir largement, comme un outil sur lequel on s'appuie vraiment.",
          en: "The result must serve broadly, like a tool people genuinely rely on.",
        },
      },
      {
        id: "one_off",
        icon: "Gauge",
        label: { fr: "Ce serait ponctuel, pour un cas précis", en: "It would be one-off, for a specific case" },
        scores: { easy_ia: 1, external_tool: 1 },
        because: {
          fr: "C'est un besoin ponctuel, sur un cas bien précis.",
          en: "It's a one-off need, for a very specific case.",
        },
      },
    ],
  },

  {
    id: "specificity",
    eyebrow: { fr: "La nature du besoin", en: "The nature of the need" },
    title: { fr: "Diriez-vous que votre besoin est…", en: "Would you say your need is…" },
    required: true,
    showIf: (a) => !isExploring(a),
    options: [
      {
        id: "very_specific",
        icon: "Fingerprint",
        label: {
          fr: "Très spécifique à notre métier, à notre façon de travailler ici",
          en: "Very specific to our job, to the way we work here",
        },
        scores: { gen_ia_factory: 1, easy_ia: 1 },
        because: {
          fr: "Votre besoin est très spécifique à votre façon de travailler.",
          en: "Your need is very specific to the way you work.",
        },
      },
      {
        id: "common",
        icon: "Globe",
        label: {
          fr: "Assez courant, sûrement partagé par beaucoup d'autres équipes ou entreprises",
          en: "Fairly common, probably shared by many other teams or companies",
        },
        scores: { external_tool: 3 },
        because: {
          fr: "C'est un besoin répandu, que d'autres ont probablement déjà résolu de leur côté.",
          en: "It's a widespread need that others have probably already solved on their side.",
        },
      },
      {
        id: "mixed",
        icon: "Blend",
        label: { fr: "Un peu des deux", en: "A bit of both" },
        scores: { generic: 1 },
      },
      {
        id: "dunno",
        icon: "HelpCircle",
        label: { fr: "Je ne sais pas encore", en: "I don't know yet" },
        scores: { generic: 1 },
      },
    ],
  },
];
