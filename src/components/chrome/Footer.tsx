"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";
import { KiabiMark } from "@/components/brand/Logo";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 mx-auto mt-10 w-full max-w-6xl px-6 pb-10">
      <div className="hairline mb-6" />
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2.5">
          <KiabiMark className="h-7 w-7" />
          <div className="leading-tight">
            <p className="text-sm font-bold text-navy">KIABI AI Guide</p>
            <p className="text-xs text-ink-muted">{t("common.footerNote")}</p>
          </div>
        </div>
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} KIABI · {t("common.team")}
        </p>
      </div>
    </footer>
  );
}
