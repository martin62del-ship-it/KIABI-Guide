"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { TopBar } from "@/components/chrome/TopBar";
import { Footer } from "@/components/chrome/Footer";
import { Aurora } from "@/components/background/Aurora";
import { Button, LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { BookingCard } from "./BookingCard";
import { ContactCard } from "./ContactCard";
import { ResourceList } from "./ResourceList";
import { RESULTS } from "@/lib/config/results";
import { BOOKING, PLACEHOLDERS } from "@/lib/config/app.config";
import { ID_TO_SLUG, RESULT_STORAGE_KEY } from "@/lib/engine/slug";
import type { Lang, Localized, RecommendationId } from "@/lib/config/types";
import { trackResultDisplayed } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

const ACCENT: Record<
  string,
  { grad: string; chip: string; soft: string; ring: string; badge: "brand" | "navy" | "violet" | "amber" | "emerald" | "slate" }
> = {
  brand: { grad: "from-brand to-brand-cyan", chip: "text-brand", soft: "bg-brand/10 text-brand", ring: "ring-brand/20", badge: "brand" },
  navy: { grad: "from-navy via-navy-600 to-brand", chip: "text-navy", soft: "bg-navy/[0.06] text-navy", ring: "ring-navy/15", badge: "navy" },
  violet: { grad: "from-violet-500 to-fuchsia-500", chip: "text-violet-600", soft: "bg-violet-500/10 text-violet-600", ring: "ring-violet-500/20", badge: "violet" },
  amber: { grad: "from-amber-400 to-orange-500", chip: "text-amber-600", soft: "bg-amber-500/10 text-amber-600", ring: "ring-amber-500/20", badge: "amber" },
  emerald: { grad: "from-emerald-400 to-teal-500", chip: "text-emerald-600", soft: "bg-emerald-500/10 text-emerald-600", ring: "ring-emerald-500/20", badge: "emerald" },
  slate: { grad: "from-slate-500 to-slate-700", chip: "text-slate-600", soft: "bg-slate-500/10 text-slate-600", ring: "ring-slate-500/20", badge: "slate" },
};

interface StoredResult {
  primary: RecommendationId;
  secondary?: RecommendationId;
  reasons: Localized[];
  lowConfidence?: boolean;
}

export function ResultView({ type }: { type: RecommendationId }) {
  const { t, tx, lang } = useLang();
  const content = RESULTS[type];
  const accent = ACCENT[content.accent];

  const [stored, setStored] = useState<StoredResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredResult;
        if (parsed.primary === type) setStored(parsed);
      }
    } catch {
      /* ignore */
    }
    trackResultDisplayed(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const reasons = stored?.reasons ?? [];
  const secondary = stored?.secondary;

  const examples = useMemo(() => mergeExamples(type, lang), [type, lang]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="relative min-h-dvh">
      <TopBar showCta={false} />

      {/* Hero band */}
      <section className="relative isolate overflow-hidden px-6 pb-4 pt-10">
        <Aurora />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <span
              className={cn(
                "relative grid h-20 w-20 place-items-center rounded-[1.6rem] bg-gradient-to-br text-white shadow-glow",
                accent.grad,
              )}
            >
              <span className="absolute inset-0 rounded-[1.6rem] bg-white/20 animate-pulse-ring" />
              <Icon name={content.icon} className="h-9 w-9" />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="mt-5 flex items-center justify-center gap-2">
              <Badge tone={accent.badge}>{t("result.eyebrow")}</Badge>
              <Badge tone="soft" className="normal-case">{tx(content.tag)}</Badge>
            </div>
            <h1 className="mt-5 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl">
              {tx(content.title)}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-ink-soft">
              {tx(content.interpretation)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <div className="relative mx-auto max-w-4xl px-6 pb-6">
        {/* Why + What */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoCard icon="Lightbulb" label={t("result.whyLabel")} accent={accent}>
            {tx(content.why)}
          </InfoCard>
          <InfoCard icon="Sparkle" label={t("result.whatLabel")} accent={accent}>
            {tx(content.whatItDoes)}
          </InfoCard>
        </div>

        {/* Based on your answers */}
        {reasons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn("mt-4 rounded-3xl border bg-white p-6 shadow-soft", accent.ring, "ring-1")}
          >
            <div className="flex items-center gap-2">
              <span className={cn("grid h-7 w-7 place-items-center rounded-lg", accent.soft)}>
                <Icon name="Check" className="h-4 w-4" strokeWidth={3} />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                {t("result.becauseLabel")}
              </h2>
            </div>
            <ul className="mt-4 grid gap-2.5">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-ink-soft">
                  <Icon name="Check" className={cn("mt-0.5 h-4 w-4 shrink-0", accent.chip)} strokeWidth={3} />
                  <span>{tx(r)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Examples */}
        <div className="mt-4 rounded-3xl border border-navy/[0.06] bg-white p-6 shadow-soft">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
            {t("result.examplesLabel")}
          </h2>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {examples.map((ex, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full", accent.soft)}>
                  <Icon name="Check" className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm text-ink-soft">{ex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Optional note (buy-vs-build, MS vs IAK, prep guidance…) */}
        {content.note && (
          <div className={cn("mt-4 rounded-3xl border-l-4 bg-white p-6 shadow-soft", noteBorder(content.accent))}>
            <p className="text-sm leading-relaxed text-ink-soft">{tx(content.note)}</p>
          </div>
        )}

        {/* Action section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <span className={cn("grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br text-white", accent.grad)}>
              <Icon name="Rocket" className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-extrabold tracking-tight text-navy">{t("result.actLabel")}</h2>
          </div>
          <ActionSection type={type} />
        </div>

        {/* Secondary recommendation */}
        {secondary && secondary !== type && <SecondaryTeaser id={secondary} />}

        {/* Footer actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/guide">
            <Button variant="secondary" size="md">
              <Icon name="ArrowLeft" className="h-4 w-4" />
              {t("result.restart")}
            </Button>
          </Link>
          <Button variant="ghost" size="md" onClick={copyLink}>
            <Icon name={copied ? "Check" : "ExternalLink"} className="h-4 w-4" />
            {copied ? t("result.copied") : t("result.copyLink")}
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// ---- sub-components --------------------------------------------------

function InfoCard({
  icon,
  label,
  accent,
  children,
}: {
  icon: string;
  label: string;
  accent: (typeof ACCENT)[string];
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-navy/[0.06] bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <span className={cn("grid h-8 w-8 place-items-center rounded-xl", accent.soft)}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">{label}</h2>
      </div>
      <p className="mt-3 text-pretty leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}

function ActionSection({ type }: { type: RecommendationId }) {
  const { t } = useLang();

  switch (type) {
    case "easy_ia":
      return (
        <div>
          <p className="mb-4 text-sm text-ink-muted">{t("result.bothVisible")}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <BookingCard contact={BOOKING.gautier} index={0} />
            <BookingCard contact={BOOKING.loic} index={1} />
          </div>
        </div>
      );
    case "easy_microsoft":
      return <BookingCard contact={BOOKING.matthieu} index={0} highlight />;
    case "gen_ia_factory":
      return (
        <ContactCard
          contact={PLACEHOLDERS.GEN_IA_FACTORY_CONTACT}
          analyticsKey="younes"
          accentClass="bg-gradient-to-br from-violet-500 to-fuchsia-500"
        />
      );
    case "external_tool":
      return (
        <ContactCard
          contact={PLACEHOLDERS.JUSTINE_SANSON_CONTACT}
          analyticsKey="justine"
          accentClass="bg-gradient-to-br from-amber-400 to-orange-500"
        />
      );
    case "faq":
      return <ResourceList />;
    case "generic":
    default:
      return (
        <ContactCard
          contact={PLACEHOLDERS.GENERIC_INNOVATION_CONTACT}
          analyticsKey="generic"
          accentClass="bg-gradient-to-br from-slate-500 to-slate-700"
        />
      );
  }
}

function SecondaryTeaser({ id }: { id: RecommendationId }) {
  const { t, tx } = useLang();
  const content = RESULTS[id];
  const accent = ACCENT[content.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8 overflow-hidden rounded-3xl border border-navy/[0.06] bg-gradient-to-br from-white to-surface-muted p-6 shadow-soft"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-faint">
        {t("result.secondaryLabel")}
      </p>
      <div className="mt-3 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className={cn("grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow-sm", accent.grad)}>
            <Icon name={content.icon} className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-ink-muted">{t("result.secondaryIntro")}</p>
            <h3 className="text-base font-bold text-navy">{tx(content.tag)}</h3>
          </div>
        </div>
        <Link href={`/result/${ID_TO_SLUG[id]}`}>
          <Button variant="outline" size="sm">
            {t("result.seeSecondary")}
            <Icon name="ArrowRight" className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ---- helpers ---------------------------------------------------------

function noteBorder(accent: string): string {
  const map: Record<string, string> = {
    brand: "border-brand/60",
    navy: "border-navy/40",
    violet: "border-violet-400",
    amber: "border-amber-400",
    emerald: "border-emerald-400",
    slate: "border-slate-400",
  };
  return map[accent] ?? "border-brand/60";
}

function mergeExamples(type: RecommendationId, lang: Lang): string[] {
  const base = RESULTS[type].examples[lang];
  const extras: Record<string, Localized[]> = {
    easy_ia: PLACEHOLDERS.EASY_IA_EXTRA_EXAMPLES,
    easy_microsoft: PLACEHOLDERS.EASY_MICROSOFT_EXTRA_EXAMPLES,
    gen_ia_factory: PLACEHOLDERS.GEN_IA_FACTORY_EXAMPLES,
    external_tool: PLACEHOLDERS.EXTERNAL_TOOL_EXAMPLES,
  };
  const extra = (extras[type] ?? []).map((e) => e[lang]);
  // de-dupe while preserving order
  return [...new Set([...base, ...extra])];
}
