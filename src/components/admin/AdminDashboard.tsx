"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { KiabiLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Ring } from "@/components/ui/Progress";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { QUESTIONS } from "@/lib/config/questions";
import { RESULTS } from "@/lib/config/results";
import { PLACEHOLDERS } from "@/lib/config/app.config";
import type { DashboardData } from "@/lib/analytics/store";
import type { Lang, RecommendationId } from "@/lib/config/types";
import { trackAdminDashboardViewed } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

type RangePreset = "7" | "30" | "90" | "all";

const TARGET_LABELS: Record<string, string> = {
  gautier: "Gautier Masse",
  loic: "Loïc Bontemps",
  matthieu: "Matthieu Servien",
  younes: "Younes (GEN IA Factory)",
  justine: "Justine Sanson",
  generic: "Contact Innovation",
};

export function AdminDashboard({ email }: { email: string }) {
  const { t, tx, lang } = useLang();
  const router = useRouter();

  const [range, setRange] = useState<RangePreset>("30");
  const [langFilter, setLangFilter] = useState<Lang | "all">("all");
  const [recFilter, setRecFilter] = useState<RecommendationId | "all">("all");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackAdminDashboardViewed();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (range !== "all") {
      const from = new Date();
      from.setDate(from.getDate() - Number(range));
      params.set("from", from.toISOString().slice(0, 10));
    }
    if (langFilter !== "all") params.set("lang", langFilter);
    if (recFilter !== "all") params.set("recommendation", recFilter);

    setLoading(true);
    fetch(`/api/admin/dashboard?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setData(res.data as DashboardData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [range, langFilter, recFilter]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const questionLabel = useMemo(() => {
    const map = new Map<string, { q: string; opts: Map<string, string> }>();
    for (const q of QUESTIONS) {
      const opts = new Map(q.options.map((o) => [o.id, o.label[lang]]));
      map.set(q.id, { q: q.title[lang], opts });
    }
    return map;
  }, [lang]);

  const maxDist = Math.max(1, ...(data?.distribution.map((d) => d.count) ?? [0]));

  return (
    <main className="min-h-dvh bg-surface-soft">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-navy/[0.06] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <KiabiLogo showSub={false} />
            <span className="hidden h-6 w-px bg-navy/10 sm:block" />
            <span className="hidden text-sm font-semibold text-ink-soft sm:block">
              {t("admin.dashboard")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="hidden text-xs text-ink-muted md:block">{email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <Icon name="LogOut" className="h-4 w-4" />
              {t("admin.logout")}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Title + demo badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-navy">
              {t("admin.overview")}
            </h1>
            <p className="text-sm text-ink-muted">
              {loading ? t("common.loading") : `${data?.eventsConsidered ?? 0} ${t("admin.events")}`}
            </p>
          </div>
          {data && !data.hasRuntimeData && (
            <Badge tone="amber" className="normal-case">
              <Icon name="Sparkle" className="h-3.5 w-3.5" />
              {t("admin.demoBadge")}
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border border-navy/[0.06] bg-white p-4 shadow-soft">
          <FilterSelect
            label={t("admin.dateRange")}
            value={range}
            onChange={(v) => setRange(v as RangePreset)}
            options={[
              { value: "7", label: t("admin.last7") },
              { value: "30", label: t("admin.last30") },
              { value: "90", label: t("admin.last90") },
              { value: "all", label: t("admin.allTime") },
            ]}
          />
          <FilterSelect
            label={t("admin.language")}
            value={langFilter}
            onChange={(v) => setLangFilter(v as Lang | "all")}
            options={[
              { value: "all", label: t("admin.allLanguages") },
              { value: "fr", label: "FR" },
              { value: "en", label: "EN" },
            ]}
          />
          <FilterSelect
            label={t("admin.recommendation")}
            value={recFilter}
            onChange={(v) => setRecFilter(v as RecommendationId | "all")}
            options={[
              { value: "all", label: t("admin.allRecommendations") },
              ...(Object.keys(RESULTS) as RecommendationId[]).map((id) => ({
                value: id,
                label: RESULTS[id].tag[lang],
              })),
            ]}
          />
        </div>

        {/* KPIs */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon="Globe" label={t("admin.visits")} value={data?.totals.visits} accent="from-brand to-brand-cyan" />
          <Kpi icon="Users" label={t("admin.sessions")} value={data?.totals.sessions} accent="from-navy to-brand" />
          <Kpi icon="Rocket" label={t("admin.starts")} value={data?.totals.starts} accent="from-violet-500 to-fuchsia-500" />
          <div className="relative overflow-hidden rounded-3xl border border-navy/[0.06] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {t("admin.completions")}
                </p>
                <p className="mt-1 text-3xl font-extrabold text-navy">{data?.totals.completions ?? "—"}</p>
                <p className="mt-1 text-xs text-ink-faint">{t("admin.completionRate")}</p>
              </div>
              <Ring value={data?.totals.completionRate ?? 0} size={64} />
            </div>
          </div>
        </div>

        {/* Distribution + clicks */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Panel icon="BarChart3" title={t("admin.distribution")}>
            {data && data.distribution.length > 0 ? (
              <div className="space-y-3">
                {data.distribution.map((d) => (
                  <div key={d.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-navy">{tx(RESULTS[d.id].tag)}</span>
                      <span className="tabular-nums text-ink-muted">{d.count}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy/[0.06]">
                      <div
                        className="h-full rounded-full bg-brand-gradient"
                        style={{ width: `${(d.count / maxDist) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty text={t("admin.noData")} />
            )}
          </Panel>

          <Panel icon="ExternalLink" title={t("admin.clicks")}>
            <div className="space-y-5">
              <ClickGroup title={t("admin.bookingClicks")} items={data?.clicks.booking} />
              <ClickGroup title={t("admin.contactClicks")} items={data?.clicks.contact} />
              <ClickGroup title={t("admin.faqClicks")} items={data?.clicks.faq} faq />
              {data &&
                data.clicks.booking.length === 0 &&
                data.clicks.contact.length === 0 &&
                data.clicks.faq.length === 0 && <Empty text={t("admin.noData")} />}
            </div>
          </Panel>
        </div>

        {/* Answers per question */}
        <div className="mt-6">
          <Panel icon="PencilRuler" title={t("admin.answersBreakdown")}>
            {data && data.answers.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {data.answers.map((qa) => {
                  const meta = questionLabel.get(qa.questionId);
                  const maxOpt = Math.max(1, ...qa.options.map((o) => o.count));
                  return (
                    <div key={qa.questionId} className="rounded-2xl border border-navy/[0.06] bg-surface-soft p-4">
                      <p className="text-sm font-bold text-navy">{meta?.q ?? qa.questionId}</p>
                      <p className="mb-3 text-xs text-ink-faint">
                        {qa.total} {t("admin.events")}
                      </p>
                      <div className="space-y-2">
                        {qa.options.map((o) => (
                          <div key={o.answerId}>
                            <div className="mb-0.5 flex items-center justify-between text-xs">
                              <span className="text-ink-soft">{meta?.opts.get(o.answerId) ?? o.answerId}</span>
                              <span className="tabular-nums text-ink-muted">{o.count}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/[0.06]">
                              <div
                                className="h-full rounded-full bg-brand/70"
                                style={{ width: `${(o.count / maxOpt) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty text={t("admin.noData")} />
            )}
          </Panel>
        </div>

        {/* Content/config entry points + placeholders */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Panel icon="Code2" title={t("admin.content")}>
            <p className="mb-4 text-sm text-ink-muted">{t("admin.contentIntro")}</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <ConfigEntry label={t("admin.editQuestions")} file="src/lib/config/questions.ts" />
              <ConfigEntry label={t("admin.editResults")} file="src/lib/config/results.ts" />
              <ConfigEntry label={t("admin.editContacts")} file="src/lib/config/app.config.ts" />
              <ConfigEntry label={t("admin.editScoring")} file="src/lib/config/scoring.ts" />
              <ConfigEntry label={t("admin.editTranslations")} file="src/lib/config/translations.ts" />
            </div>
          </Panel>

          <Panel icon="HelpCircle" title={t("admin.placeholdersTitle")}>
            <p className="mb-4 text-sm text-ink-muted">{t("admin.placeholdersIntro")}</p>
            <div className="space-y-2">
              {placeholderStatus().map((p) => (
                <div
                  key={p.key}
                  className="flex items-center justify-between rounded-xl border border-navy/[0.06] bg-surface-soft px-4 py-2.5"
                >
                  <code className="text-xs font-semibold text-navy">{p.key}</code>
                  <Badge tone={p.complete ? "emerald" : "amber"} className="normal-case">
                    <Icon name={p.complete ? "Check" : "HelpCircle"} className="h-3.5 w-3.5" />
                    {p.complete ? t("admin.set") : t("admin.missing")}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <p className="mt-8 text-center text-xs text-ink-faint">
          <Link href="/" className="font-semibold text-brand hover:underline">
            ← {t("common.backHome")}
          </Link>
        </p>
      </div>
    </main>
  );
}

// ---- sub-components --------------------------------------------------

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: string;
  label: string;
  value?: number;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-navy/[0.06] bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white", accent)}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tabular-nums text-navy">{value ?? "—"}</p>
    </div>
  );
}

function Panel({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-navy/[0.06] bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-navy/[0.05] text-navy">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <h2 className="text-base font-bold text-navy">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ClickGroup({
  title,
  items,
  faq = false,
}: {
  title: string;
  items?: { target: string; count: number }[];
  faq?: boolean;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{title}</p>
      <div className="space-y-1.5">
        {items.map((it) => (
          <div
            key={it.target}
            className="flex items-center justify-between rounded-xl bg-surface-soft px-3 py-2 text-sm"
          >
            <span className="text-ink-soft">
              {faq ? it.target.replace("faq:", "FAQ #") : TARGET_LABELS[it.target] ?? it.target}
            </span>
            <span className="font-bold tabular-nums text-navy">{it.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigEntry({ label, file }: { label: string; file: string }) {
  return (
    <div className="rounded-xl border border-navy/[0.06] bg-surface-soft px-4 py-3">
      <p className="text-sm font-semibold text-navy">{label}</p>
      <code className="mt-0.5 block truncate text-[0.7rem] text-ink-muted">{file}</code>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl border border-navy/10 bg-white px-3 text-sm font-medium text-navy outline-none transition-shadow focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-navy/10 py-10 text-center">
      <p className="text-sm text-ink-muted">{text}</p>
    </div>
  );
}

function placeholderStatus() {
  const c = (v: { email?: string; url?: string }) => Boolean(v.email || v.url);
  return [
    { key: "GEN_IA_FACTORY_CONTACT", complete: c(PLACEHOLDERS.GEN_IA_FACTORY_CONTACT) },
    { key: "JUSTINE_SANSON_CONTACT", complete: c(PLACEHOLDERS.JUSTINE_SANSON_CONTACT) },
    { key: "GENERIC_INNOVATION_CONTACT", complete: c(PLACEHOLDERS.GENERIC_INNOVATION_CONTACT) },
    { key: "FAQ_LINKS", complete: PLACEHOLDERS.FAQ_LINKS.some((l) => Boolean(l.url)) },
    { key: "EASY_IA_EXTRA_EXAMPLES", complete: PLACEHOLDERS.EASY_IA_EXTRA_EXAMPLES.length > 0 },
    { key: "EASY_MICROSOFT_EXTRA_EXAMPLES", complete: PLACEHOLDERS.EASY_MICROSOFT_EXTRA_EXAMPLES.length > 0 },
    { key: "GEN_IA_FACTORY_EXAMPLES", complete: PLACEHOLDERS.GEN_IA_FACTORY_EXAMPLES.length > 0 },
    { key: "EXTERNAL_TOOL_EXAMPLES", complete: PLACEHOLDERS.EXTERNAL_TOOL_EXAMPLES.length > 0 },
  ];
}
