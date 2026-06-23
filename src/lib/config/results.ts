// =====================================================================
// RESULT CONTENT — bilingual copy for each of the 6 recommendations.
// Copy is grounded in the real Easy IA / Easy Microsoft internal comms.
// =====================================================================

import type { RecommendationId, ResultContent } from "./types";

export const RESULTS: Record<RecommendationId, ResultContent> = {
  easy_ia: {
    id: "easy_ia",
    tag: { fr: "Easy IA", en: "Easy IA" },
    title: { fr: "Easy IA est fait pour vous", en: "Easy IA is your best match" },
    interpretation: {
      fr: "Vous voulez résoudre un besoin métier concret avec un assistant IA, sans développement.",
      en: "You want to solve a concrete business need with an AI assistant, without development.",
    },
    why: {
      fr: "Votre besoin est simple à moyennement complexe et peut être traité par un assistant créé dans IAK, la plateforme interne. Pas de développement sur mesure, pas de dépendance technique forte : un créneau d'1 heure suffit pour avancer.",
      en: "Your need is simple to medium complexity and can be solved with an assistant built in IAK, the internal platform. No custom development, no heavy technical dependency: a 1-hour session is enough to move forward.",
    },
    whatItDoes: {
      fr: "Easy IA vous accompagne pour créer rapidement un assistant IA adapté à votre métier. Vous venez avec une problématique, un irritant ou une idée ; vous repartez avec un assistant fonctionnel ou une feuille de route claire. Déjà plus de 50 assistants créés et utilisés au quotidien (RH, Communication, Supply, Juridique, Achats, Finance).",
      en: "Easy IA helps you quickly build an AI assistant tailored to your role. You arrive with a problem, a friction point or an idea; you leave with a working assistant or a clear roadmap. Already 50+ assistants created and used daily (HR, Comms, Supply, Legal, Procurement, Finance).",
    },
    examples: {
      fr: [
        "Génération de comptes rendus de réunion",
        "Création de plans de communication",
        "Assistants RH et recrutement",
        "Recherche documentaire",
        "Analyse et synthèse de données",
        "Support juridique",
      ],
      en: [
        "Meeting summary generation",
        "Communication plan generation",
        "HR & recruitment assistants",
        "Document research",
        "Data analysis & synthesis",
        "Legal support",
      ],
    },
    accent: "brand",
    icon: "Sparkles",
  },

  easy_microsoft: {
    id: "easy_microsoft",
    tag: { fr: "Easy Microsoft", en: "Easy Microsoft" },
    title: { fr: "Easy Microsoft est la bonne porte", en: "Easy Microsoft is the right door" },
    interpretation: {
      fr: "Votre besoin s'appuie sur l'écosystème Microsoft : automatisation, données ou applications.",
      en: "Your need relies on the Microsoft ecosystem: automation, data or applications.",
    },
    why: {
      fr: "Quand le besoin dépend des outils Microsoft, mobilise des connecteurs, des workflows, du reporting ou des données SharePoint, ou dépasse les limites d'un simple assistant IAK, Easy Microsoft est plus pertinent. Vous bénéficiez d'outils Microsoft-natifs et d'intégrations que IAK ne couvre pas.",
      en: "When the need depends on Microsoft tools, relies on connectors, workflows, reporting or SharePoint data, or goes beyond what a simple IAK assistant can do, Easy Microsoft is the better fit. You get Microsoft-native tools and integrations that IAK doesn't cover.",
    },
    whatItDoes: {
      fr: "Easy Microsoft vous aide à concevoir et mettre en œuvre des solutions via Microsoft 365 et la Power Platform, avec l'accompagnement de Matthieu Servien : analyse du besoin, recommandations, solution mise en œuvre ou feuille de route, et pistes d'optimisation pour gagner du temps.",
      en: "Easy Microsoft helps you design and implement solutions using Microsoft 365 and the Power Platform, with Matthieu Servien's support: needs analysis, recommendations, an implemented solution or roadmap, and optimisation ideas to save time.",
    },
    examples: {
      fr: [
        "Automatisation de tâches répétitives avec Power Automate",
        "Création d'applications métiers avec Power Apps",
        "Centralisation et exploitation de données SharePoint",
        "Optimisation Excel, Outlook, Teams, PowerPoint, M365",
        "Construction de tableaux de bord et reportings",
      ],
      en: [
        "Repetitive task automation with Power Automate",
        "Business apps with Power Apps",
        "Centralising & using SharePoint data",
        "Excel, Outlook, Teams, PowerPoint, M365 optimisation",
        "Building dashboards & reporting",
      ],
    },
    note: {
      fr: "Quand préférer Microsoft à IAK ? Dès que le besoin implique des connecteurs, une automatisation multi-outils, une application, du reporting structuré ou des données SharePoint — autant de choses qu'un assistant IAK seul ne peut pas faire.",
      en: "When choose Microsoft over IAK? As soon as the need involves connectors, multi-tool automation, an app, structured reporting or SharePoint data — things a standalone IAK assistant can't do.",
    },
    accent: "navy",
    icon: "AppWindow",
  },

  gen_ia_factory: {
    id: "gen_ia_factory",
    tag: { fr: "GEN IA Factory", en: "GEN IA Factory" },
    title: { fr: "Direction la GEN IA Factory", en: "Head to the GEN IA Factory" },
    interpretation: {
      fr: "Votre besoin semble complexe et appelle un produit sur mesure avec une équipe de développement.",
      en: "Your need looks complex and calls for a custom product with a development team.",
    },
    why: {
      fr: "Lorsque la solution demande du développement sur mesure, une logique produit, des intégrations avancées ou un outil interne taillé pour votre cas, ni un assistant IAK ni un outil Microsoft standard ne suffisent. La GEN IA Factory mobilise une équipe pour construire la bonne solution.",
      en: "When the solution requires custom development, product logic, advanced integrations or an internal tool tailored to your case, neither an IAK assistant nor a standard Microsoft tool is enough. The GEN IA Factory brings in a team to build the right solution.",
    },
    whatItDoes: {
      fr: "La GEN IA Factory prend en charge les besoins avancés : cadrage produit, conception, développement sur mesure et mise en œuvre d'outils IA tailored. C'est le bon interlocuteur quand l'ambition dépasse l'accompagnement guidé d'1 heure.",
      en: "The GEN IA Factory handles advanced needs: product framing, design, custom development and delivery of tailored AI-enabled tools. It's the right path when ambition goes beyond a 1-hour guided session.",
    },
    examples: {
      fr: [
        "Outil interne sur mesure relié à plusieurs systèmes",
        "Produit data/IA avec logique métier avancée",
        "Intégrations complexes entre applications",
      ],
      en: [
        "Custom internal tool wired to several systems",
        "Data/AI product with advanced business logic",
        "Complex integrations across applications",
      ],
    },
    note: {
      fr: "Prochaine étape : un échange de cadrage avec le référent GEN IA Factory pour qualifier la faisabilité et les prochaines étapes.",
      en: "Next step: a framing conversation with the GEN IA Factory lead to qualify feasibility and next steps.",
    },
    accent: "violet",
    icon: "Boxes",
  },

  external_tool: {
    id: "external_tool",
    tag: { fr: "Outil du marché", en: "Market tool" },
    title: { fr: "Un outil du marché sera plus malin", en: "A market tool will be smarter" },
    interpretation: {
      fr: "Une solution existante pourrait répondre plus vite, moins cher et plus simplement.",
      en: "An existing solution could answer faster, cheaper and more simply.",
    },
    why: {
      fr: "Quand une solution éprouvée existe déjà sur le marché, l'adopter est souvent plus pertinent que la construire : gain de temps, coût maîtrisé, intégration facilitée et maintenance assurée par l'éditeur. Mieux vaut acheter que réinventer.",
      en: "When a proven solution already exists on the market, adopting it is often smarter than building it: time saved, controlled cost, easier integration and vendor-maintained. Better to buy than reinvent.",
    },
    whatItDoes: {
      fr: "Cette orientation vous met en relation avec la personne qui pilote l'acquisition d'outils et de licences, pour évaluer la solution la plus adaptée et le bon chemin d'achat.",
      en: "This path connects you with the person who drives tool and license purchasing, to assess the best-fit solution and the right buying route.",
    },
    examples: {
      fr: [
        "Solution SaaS déjà éprouvée sur le marché",
        "Licence d'un outil spécialisé prêt à l'emploi",
        "Module complémentaire à un logiciel existant",
      ],
      en: [
        "Proven off-the-shelf SaaS solution",
        "License for a ready-to-use specialised tool",
        "Add-on module for an existing software",
      ],
    },
    note: {
      fr: "Logique « acheter plutôt que construire » : si la vitesse, le coût ou la facilité d'intégration priment, un outil du marché l'emporte sur un développement interne.",
      en: "\"Buy over build\" rationale: if speed, cost or ease of integration matter most, a market tool beats internal development.",
    },
    accent: "amber",
    icon: "ShoppingBag",
  },

  faq: {
    id: "faq",
    tag: { fr: "Documentation", en: "Documentation" },
    title: { fr: "Commencez par explorer", en: "Start by exploring" },
    interpretation: {
      fr: "Vous êtes en phase de découverte : autant comprendre les possibilités avant un rendez-vous.",
      en: "You're in discovery mode: best to understand what's possible before booking.",
    },
    why: {
      fr: "Votre besoin n'est pas encore mûr pour un créneau d'accompagnement. Quelques ressources vous aideront à cerner ce qui est possible, à préparer votre idée et à arriver avec un besoin clair — ce qui rendra tout accompagnement futur bien plus efficace.",
      en: "Your need isn't quite ready for a guided session yet. A few resources will help you grasp what's possible, prepare your idea and arrive with a clear need — making any future session far more effective.",
    },
    whatItDoes: {
      fr: "Cette orientation vous propose des ressources de découverte et de préparation. Quand votre besoin sera clair, vous pourrez relancer le guide et réserver le bon créneau.",
      en: "This path offers discovery and preparation resources. Once your need is clear, you can restart the guide and book the right session.",
    },
    examples: {
      fr: [
        "Comprendre ce qu'on peut faire avec un assistant IA",
        "Préparer son besoin avant un créneau",
        "S'inspirer des assistants déjà créés",
      ],
      en: [
        "Understand what an AI assistant can do",
        "Prepare your need before a session",
        "Get inspired by assistants already built",
      ],
    },
    note: {
      fr: "Pour préparer un futur rendez-vous : un descriptif de votre besoin, des exemples de documents concernés, et une estimation du temps passé sur la tâche à améliorer.",
      en: "To prepare a future session: a description of your need, examples of the documents involved, and an estimate of the time spent on the task you want to improve.",
    },
    accent: "emerald",
    icon: "BookOpen",
  },

  generic: {
    id: "generic",
    tag: { fr: "Contact Innovation", en: "Innovation contact" },
    title: { fr: "Parlons-en avec l'équipe Innovation", en: "Let's talk with the Innovation team" },
    interpretation: {
      fr: "Votre besoin est hybride ou encore flou : une qualification humaine sera plus juste.",
      en: "Your need is hybrid or still fuzzy: a human qualification will serve you better.",
    },
    why: {
      fr: "Plusieurs pistes sont possibles et aucune ne se détache nettement. Plutôt que de vous router automatiquement, un échange court avec l'équipe Innovation & IA Gen permettra de qualifier précisément votre besoin et de vous orienter vers le bon dispositif.",
      en: "Several paths are possible and none clearly stands out. Rather than auto-routing you, a short exchange with the Innovation & IA Gen team will precisely qualify your need and point you to the right service.",
    },
    whatItDoes: {
      fr: "L'équipe Innovation & IA Gen vous écoute, clarifie votre besoin et vous oriente vers Easy IA, Easy Microsoft, la GEN IA Factory ou une autre solution. Aucun besoin n'est trop flou pour démarrer la conversation.",
      en: "The Innovation & IA Gen team listens, clarifies your need and points you to Easy IA, Easy Microsoft, the GEN IA Factory or another solution. No need is too fuzzy to start the conversation.",
    },
    examples: {
      fr: [
        "Besoin transverse touchant plusieurs dispositifs",
        "Idée encore large à préciser ensemble",
        "Doute sur le bon point d'entrée",
      ],
      en: [
        "Cross-cutting need spanning several services",
        "Still-broad idea to refine together",
        "Unsure which entry point is right",
      ],
    },
    accent: "slate",
    icon: "Users",
  },
};
