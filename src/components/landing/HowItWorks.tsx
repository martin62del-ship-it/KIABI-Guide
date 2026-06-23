"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Aurora } from "@/components/background/Aurora";
import { trackCtaClicked } from "@/lib/analytics/client";

export function HowItWorks() {
  const { t } = useLang();
  const steps = [
    { icon: "PencilRuler", title: t("landing.step1Title"), text: t("landing.step1Text") },
    { icon: "Wand2", title: t("landing.step2Title"), text: t("landing.step2Text") },
    { icon: "Rocket", title: t("landing.step3Title"), text: t("landing.step3Text") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] px-6 py-14 text-white shadow-lift sm:px-12">
        <Aurora tone="dark" />
        <div className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-glow">
              {t("landing.howTitle")}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("landing.title1")} <span className="text-gradient">{t("landing.titleHighlight")}</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-brand-glow ring-1 ring-white/15">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-white/40">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/guide" onClick={() => trackCtaClicked("how-it-works")}>
              <Button size="lg" variant="primary">
                {t("landing.primaryCta")}
                <Icon name="ArrowRight" className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
