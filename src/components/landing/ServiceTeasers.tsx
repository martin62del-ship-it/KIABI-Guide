"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const SERVICES = [
  { key: "easy_ia", icon: "Sparkles", accent: "from-brand to-brand-cyan" },
  { key: "easy_microsoft", icon: "AppWindow", accent: "from-navy to-brand" },
  { key: "gen_ia_factory", icon: "Boxes", accent: "from-violet-500 to-fuchsia-500" },
  { key: "external_tool", icon: "ShoppingBag", accent: "from-amber-400 to-orange-500" },
] as const;

export function ServiceTeasers() {
  const { t } = useLang();
  return (
    <section id="services" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          {t("landing.teaserTitle")}
        </h2>
        <p className="mt-3 text-lg text-ink-soft">{t("landing.teaserSubtitle")}</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <motion.article
            key={s.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-3xl border border-navy/[0.06] bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
          >
            {/* hover glow */}
            <div
              className={cn(
                "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20",
                s.accent,
              )}
            />
            <div
              className={cn(
                "relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow-sm",
                s.accent,
              )}
            >
              <Icon name={s.icon} className="h-6 w-6" />
            </div>
            <h3 className="relative mt-5 text-lg font-bold text-navy">
              {t(`services.${s.key}.name`)}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">
              {t(`services.${s.key}.tagline`)}
            </p>
            <div className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
              <span className="h-px w-5 bg-brand" />
            </div>
          </motion.article>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink-muted">
        {t("landing.secondaryMessage")}
      </p>
    </section>
  );
}
