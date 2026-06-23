"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Aurora } from "@/components/background/Aurora";
import { Particles } from "@/components/background/Particles";
import { KiabiMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { trackCtaClicked } from "@/lib/analytics/client";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ORBIT = [
  { icon: "Sparkles", label: "Easy IA", angle: 0 },
  { icon: "AppWindow", label: "Easy Microsoft", angle: 72 },
  { icon: "Boxes", label: "GEN IA Factory", angle: 144 },
  { icon: "ShoppingBag", label: "Market tool", angle: 216 },
  { icon: "BookOpen", label: "Docs", angle: 288 },
];

export function Hero() {
  const { t } = useLang();

  const stats = [
    { v: t("landing.stat1Value"), l: t("landing.stat1Label") },
    { v: t("landing.stat2Value"), l: t("landing.stat2Label") },
    { v: t("landing.stat3Value"), l: t("landing.stat3Label") },
  ];

  return (
    <section className="relative isolate overflow-hidden px-6 pb-10 pt-14 sm:pt-20">
      <Aurora />
      <Particles className="opacity-70" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              {t("landing.eyebrow")}
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl"
          >
            {t("landing.title1")}{" "}
            <span className="text-gradient">{t("landing.titleHighlight")}</span>{" "}
            {t("landing.title2")}
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft lg:mx-0"
          >
            {t("landing.subtitle")}
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/guide" onClick={() => trackCtaClicked("hero")}>
              <Button size="lg" className="w-full sm:w-auto">
                {t("landing.primaryCta")}
                <Icon name="ArrowRight" className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {t("landing.secondaryCta")}
              </Button>
            </a>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 flex items-center justify-center gap-6 lg:justify-start"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-6">
                {i > 0 && <span className="h-9 w-px bg-navy/10" />}
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-extrabold text-navy">{s.v}</div>
                  <div className="text-xs font-medium text-ink-muted">{s.l}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Orbit visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto hidden aspect-square w-full max-w-md sm:block"
        >
          <OrbitVisual />
        </motion.div>
      </div>
    </section>
  );
}

function OrbitVisual() {
  return (
    <div className="relative h-full w-full">
      {/* rings */}
      {[0.55, 0.8, 1].map((scale, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border border-navy/[0.07]"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* center mark */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-28 w-28 place-items-center rounded-[2rem] bg-white shadow-card">
          <span className="absolute inset-0 rounded-[2rem] bg-brand/10 animate-pulse-ring" />
          <KiabiMark className="h-16 w-16" withPulse />
        </div>
      </div>

      {/* rotating orbit of services */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 44, ease: "linear", repeat: Infinity }}
      >
        {ORBIT.map((item) => {
          const rad = (item.angle * Math.PI) / 180;
          const radius = 44; // % from center
          const x = 50 + radius * Math.cos(rad);
          const y = 50 + radius * Math.sin(rad);
          return (
            <motion.div
              key={item.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 44, ease: "linear", repeat: Infinity }}
            >
              <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-3 py-2 shadow-soft backdrop-blur">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand/10 text-brand">
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
                <span className="whitespace-nowrap text-xs font-semibold text-navy">
                  {item.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
