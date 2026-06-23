// =====================================================================
// QUESTIONS — the guided flow. Fully editable.
//
// ▸ Each answer adds points to one or more recommendation categories.
// ▸ `showIf` enables lightweight branching (keeps the flow short).
// ▸ `because` is the human-readable rationale surfaced on the result page.
//
// Branching summary (longest path ≈ 7 steps, "just exploring" ≈ 2 steps):
//   Q1 main_goal           ── always
//   Q2 microsoft_dependency ── unless exploring
//   Q3 microsoft_tools      ── only if Microsoft matters (refines Easy MS)
//   Q4 solution_shape       ── unless exploring
//   Q5 complexity           ── unless exploring
//   Q6 custom_dev           ── only if not "simple" and not exploring
//   Q7 market_tool          ── unless exploring or already chose "buy"
//   Q8 readiness            ── always
// =====================================================================

import type { Question } from "./types";

const isExploring = (a: Record<string, string[]>) =>
  (a.main_goal ?? []).includes("explore");

const microsoftMatters = (a: Record<string, string[]>) => {
  const dep = a.microsoft_dependency ?? [];
  return dep.includes("ms_central") || dep.includes("ms_some");
};

export const QUESTIONS: Question[] = [
  {
    id: "main_goal",
    eyebrow: { fr: "Votre intention", en: "Your intent" },
    title: { fr: "Quel est votre objectif principal ?", en: "What is your main goal?" },
    subtitle: {
      fr: "Choisissez ce qui décrit le mieux votre besoin du moment.",
      en: "Pick what best describes your need right now.",
    },
    required: true,
    options: [
      {
        id: "ai_assistant",
        icon: "Sparkles",
        label: { fr: "Créer un assistant IA", en: "Create an AI assistant" },
        hint: { fr: "Répondre, générer, analyser du contenu", en: "Answer, generate, analyse content" },
        scores: { easy_ia: 3 },
        because: {
          fr: "Vous visez avant tout un assistant IA pour un besoin métier concret.",
          en: "You're primarily aiming for an AI assistant for a concrete business need.",
        },
      },
      {
        id: "automate_ms",
        icon: "Workflow",
        label: { fr: "Automatiser mes outils Microsoft", en: "Automate my Microsoft tools" },
        hint: { fr: "Power Automate, SharePoint, M365…", en: "Power Automate, SharePoint, M365…" },
        scores: { easy_microsoft: 3 },
        because: {
          fr: "Votre objectif tourne autour de l'automatisation et de l'écosystème Microsoft.",
          en: "Your goal revolves around automation and the Microsoft ecosystem.",
        },
      },
      {
        id: "custom_tool",
        icon: "Boxes",
        label: { fr: "Construire un outil sur mesure", en: "Build a custom tool" },
        hint: { fr: "Un produit interne, une vraie application", en: "An internal product, a real application" },
        scores: { gen_ia_factory: 3 },
        because: {
          fr: "Vous envisagez un outil interne sur mesure, au-delà d'un simple assistant.",
          en: "You're considering a tailored internal tool, beyond a simple assistant.",
        },
      },
      {
        id: "explore",
        icon: "Compass",
        label: { fr: "Comprendre ce qui est possible", en: "Understand what's possible" },
        hint: { fr: "Je me renseigne avant de me lancer", en: "I'm exploring before getting started" },
        scores: { faq: 3 },
        because: {
          fr: "Vous êtes en phase d'exploration : mieux vaut d'abord se documenter.",
          en: "You're in an exploration phase: best to start with some learning material.",
        },
      },
      {
        id: "unsure",
        icon: "HelpCircle",
        label: { fr: "Je ne sais pas encore précisément", en: "I'm not quite sure yet" },
        hint: { fr: "Mon besoin reste à clarifier", en: "My need still needs clarifying" },
        scores: { generic: 2 },
        because: {
          fr: "Votre besoin mérite une qualification humaine pour être bien orienté.",
          en: "Your need would benefit from a human qualification step.",
        },
      },
    ],
  },

  {
    id: "microsoft_dependency",
    eyebrow: { fr: "Vos outils", en: "Your tools" },
    title: {
      fr: "Votre besoin s'appuie-t-il sur l'écosystème Microsoft ?",
      en: "Does your need rely on the Microsoft ecosystem?",
    },
    subtitle: {
      fr: "Excel, Outlook, Teams, SharePoint, Power Automate, Power Apps…",
      en: "Excel, Outlook, Teams, SharePoint, Power Automate, Power Apps…",
    },
    required: true,
    showIf: (a) => !isExploring(a),
    options: [
      {
        id: "ms_central",
        icon: "Layers",
        label: { fr: "Oui, c'est au cœur du besoin", en: "Yes, it's central" },
        scores: { easy_microsoft: 3 },
        because: {
          fr: "L'écosystème Microsoft est central : Easy Microsoft est taillé pour ça.",
          en: "The Microsoft ecosystem is central — Easy Microsoft is built for that.",
        },
      },
      {
        id: "ms_some",
        icon: "Blend",
        label: { fr: "Un peu, mais pas indispensable", en: "Somewhat, but not essential" },
        scores: { easy_microsoft: 1, easy_ia: 1 },
      },
      {
        id: "ms_no",
        icon: "CircleSlash",
        label: { fr: "Non", en: "No" },
        scores: { easy_ia: 1 },
      },
      {
        id: "ms_unknown",
        icon: "HelpCircle",
        label: { fr: "Je ne sais pas", en: "I don't know" },
        scores: { generic: 1 },
      },
    ],
  },

  {
    id: "microsoft_tools",
    eyebrow: { fr: "Périmètre Microsoft", en: "Microsoft scope" },
    title: {
      fr: "Quels usages Microsoft sont concernés ?",
      en: "Which Microsoft capabilities are involved?",
    },
    subtitle: {
      fr: "Plusieurs choix possibles — cela affine l'orientation.",
      en: "Select all that apply — this refines the routing.",
    },
    multiple: true,
    showIf: microsoftMatters,
    options: [
      {
        id: "m365",
        icon: "AppWindow",
        label: { fr: "Excel, Outlook, Teams, PowerPoint", en: "Excel, Outlook, Teams, PowerPoint" },
        scores: { easy_microsoft: 1 },
      },
      {
        id: "sharepoint",
        icon: "FolderTree",
        label: { fr: "Données SharePoint", en: "SharePoint data" },
        scores: { easy_microsoft: 2 },
        because: {
          fr: "Centraliser et exploiter des données SharePoint relève d'Easy Microsoft.",
          en: "Centralising and using SharePoint data is an Easy Microsoft job.",
        },
      },
      {
        id: "power_automate",
        icon: "Workflow",
        label: { fr: "Workflows Power Automate", en: "Power Automate workflows" },
        scores: { easy_microsoft: 2 },
        because: {
          fr: "Les workflows Power Automate sont au cœur d'Easy Microsoft.",
          en: "Power Automate workflows are at the heart of Easy Microsoft.",
        },
      },
      {
        id: "power_apps",
        icon: "LayoutGrid",
        label: { fr: "Applications Power Apps", en: "Power Apps applications" },
        scores: { easy_microsoft: 2 },
        because: {
          fr: "Construire une appli métier avec Power Apps, c'est Easy Microsoft.",
          en: "Building a business app with Power Apps is Easy Microsoft.",
        },
      },
      {
        id: "reporting",
        icon: "BarChart3",
        label: { fr: "Tableaux de bord & reporting", en: "Dashboards & reporting" },
        scores: { easy_microsoft: 2 },
        because: {
          fr: "Vos besoins de reporting s'adressent à Easy Microsoft.",
          en: "Your reporting needs point to Easy Microsoft.",
        },
      },
    ],
  },

  {
    id: "solution_shape",
    eyebrow: { fr: "La forme", en: "The shape" },
    title: { fr: "Quelle solution imaginez-vous ?", en: "What kind of solution do you picture?" },
    required: true,
    showIf: (a) => !isExploring(a),
    options: [
      {
        id: "assistant",
        icon: "Bot",
        label: { fr: "Un assistant qui génère / analyse", en: "An assistant that generates / analyses" },
        scores: { easy_ia: 2 },
        because: {
          fr: "Un assistant conversationnel correspond parfaitement à Easy IA.",
          en: "A conversational assistant is a perfect Easy IA fit.",
        },
      },
      {
        id: "workflow",
        icon: "GitBranch",
        label: { fr: "Une automatisation / un workflow", en: "An automation / a workflow" },
        scores: { easy_microsoft: 2 },
      },
      {
        id: "app",
        icon: "LayoutGrid",
        label: { fr: "Une application métier", en: "A business application" },
        scores: { easy_microsoft: 2, gen_ia_factory: 1 },
      },
      {
        id: "product",
        icon: "Boxes",
        label: { fr: "Un outil complexe et sur mesure", en: "A complex, tailored tool" },
        scores: { gen_ia_factory: 3 },
        because: {
          fr: "Un outil complexe et sur mesure relève de la GEN IA Factory.",
          en: "A complex, tailor-made tool is GEN IA Factory territory.",
        },
      },
      {
        id: "buy",
        icon: "ShoppingBag",
        label: { fr: "Un outil du marché existe peut-être", en: "Maybe a market tool already exists" },
        scores: { external_tool: 3 },
        because: {
          fr: "Si une solution du marché existe, l'achat peut être plus pertinent.",
          en: "If a market solution exists, buying may be more relevant.",
        },
      },
    ],
  },

  {
    id: "complexity",
    eyebrow: { fr: "L'ampleur", en: "The scale" },
    title: { fr: "Quelle est la complexité de votre besoin ?", en: "How complex is your need?" },
    required: true,
    showIf: (a) => !isExploring(a),
    options: [
      {
        id: "simple",
        icon: "Feather",
        label: { fr: "Simple — une tâche précise", en: "Simple — one precise task" },
        scores: { easy_ia: 2 },
        because: {
          fr: "Un besoin simple se traite très bien en une session Easy IA.",
          en: "A simple need is well handled in a single Easy IA session.",
        },
      },
      {
        id: "medium",
        icon: "Gauge",
        label: { fr: "Moyenne — plusieurs étapes", en: "Medium — several steps" },
        scores: { easy_ia: 1, easy_microsoft: 1 },
      },
      {
        id: "complex",
        icon: "Network",
        label: { fr: "Élevée — intégrations, logique produit", en: "High — integrations, product logic" },
        scores: { gen_ia_factory: 3 },
        because: {
          fr: "Une forte complexité oriente vers un accompagnement GEN IA Factory.",
          en: "High complexity points to GEN IA Factory support.",
        },
      },
    ],
  },

  {
    id: "custom_dev",
    eyebrow: { fr: "Le développement", en: "Development" },
    title: {
      fr: "Un développement sur mesure semble-t-il nécessaire ?",
      en: "Does custom development seem necessary?",
    },
    required: true,
    showIf: (a) => !isExploring(a) && !(a.complexity ?? []).includes("simple"),
    options: [
      {
        id: "no_dev",
        icon: "ThumbsUp",
        label: { fr: "Non, une solution guidée suffira", en: "No, a guided solution will do" },
        scores: { easy_ia: 1 },
      },
      {
        id: "maybe_dev",
        icon: "HelpCircle",
        label: { fr: "Peut-être", en: "Maybe" },
        scores: { gen_ia_factory: 1, generic: 1 },
      },
      {
        id: "yes_dev",
        icon: "Code2",
        label: { fr: "Oui, clairement", en: "Yes, clearly" },
        scores: { gen_ia_factory: 3 },
        because: {
          fr: "Un développement sur mesure assumé appelle la GEN IA Factory.",
          en: "Clear custom development calls for the GEN IA Factory.",
        },
      },
    ],
  },

  {
    id: "market_tool",
    eyebrow: { fr: "Le marché", en: "The market" },
    title: {
      fr: "Un outil du marché pourrait-il déjà répondre à votre besoin ?",
      en: "Could a market tool already meet your need?",
    },
    required: true,
    showIf: (a) =>
      !isExploring(a) && !(a.solution_shape ?? []).includes("buy"),
    options: [
      {
        id: "market_yes",
        icon: "ShoppingBag",
        label: { fr: "Oui, probablement", en: "Yes, probably" },
        scores: { external_tool: 3 },
        because: {
          fr: "Acheter une solution existante peut être plus rapide et économique.",
          en: "Buying an existing solution can be faster and cheaper.",
        },
      },
      {
        id: "market_maybe",
        icon: "HelpCircle",
        label: { fr: "Je ne sais pas", en: "I'm not sure" },
        scores: { generic: 1 },
      },
      {
        id: "market_no",
        icon: "Fingerprint",
        label: { fr: "Non, c'est spécifique à KIABI", en: "No, it's specific to KIABI" },
        scores: { easy_ia: 1 },
      },
    ],
  },

  {
    id: "readiness",
    eyebrow: { fr: "Votre maturité", en: "Your readiness" },
    title: { fr: "Où en êtes-vous dans votre réflexion ?", en: "Where are you in your thinking?" },
    required: true,
    options: [
      {
        id: "ready",
        icon: "Rocket",
        label: { fr: "C'est clair, prêt(e) pour un créneau d'1h", en: "It's clear, ready for a 1-hour session" },
        scores: { easy_ia: 1, easy_microsoft: 1 },
        because: {
          fr: "Vous êtes prêt(e) à passer à l'action lors d'un créneau d'1 heure.",
          en: "You're ready to take action in a 1-hour session.",
        },
      },
      {
        id: "shaping",
        icon: "PencilRuler",
        label: { fr: "J'ai une idée à cadrer", en: "I have an idea to shape" },
        scores: { generic: 1 },
      },
      {
        id: "learn_first",
        icon: "BookOpen",
        label: { fr: "Je veux d'abord explorer / me documenter", en: "I'd rather explore / read up first" },
        scores: { faq: 3 },
        because: {
          fr: "Vous préférez d'abord explorer : des ressources vous aideront à mûrir le besoin.",
          en: "You'd rather explore first — resources will help mature the need.",
        },
      },
    ],
  },
];
