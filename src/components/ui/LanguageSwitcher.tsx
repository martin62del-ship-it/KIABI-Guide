"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/config/types";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const options: Lang[] = ["fr", "en"];
  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full bg-white/70 p-0.5 ring-1 ring-inset ring-navy/10 backdrop-blur",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {options.map((opt) => {
        const active = lang === opt;
        return (
          <button
            key={opt}
            onClick={() => setLang(opt)}
            aria-pressed={active}
            className={cn(
              "relative z-10 h-7 w-9 rounded-full text-xs font-bold uppercase tracking-wide transition-colors",
              active ? "text-white" : "text-ink-muted hover:text-navy",
            )}
          >
            {active && (
              <span className="absolute inset-0 -z-10 rounded-full bg-brand-gradient shadow-glow-sm" />
            )}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
