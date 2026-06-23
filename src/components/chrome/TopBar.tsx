"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { KiabiLogo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Floating top navigation used on public pages. */
export function TopBar({
  showCta = true,
  className,
}: {
  showCta?: boolean;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <header className={cn("sticky top-0 z-40 px-4 pt-4 sm:px-6", className)}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/50 bg-white/70 px-3 py-2 pl-4 shadow-soft backdrop-blur-xl sm:px-4">
        <Link href="/" className="rounded-full" aria-label="KIABI AI Guide">
          <KiabiLogo showSub={false} />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {showCta && (
            <LinkButton href="/guide" size="sm" className="hidden sm:inline-flex">
              {t("nav.start")}
              <Icon name="ArrowRight" className="h-4 w-4" />
            </LinkButton>
          )}
          <Link
            href="/admin"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-navy/5 hover:text-navy"
            aria-label={t("nav.admin")}
            title={t("nav.admin")}
          >
            <Icon name="Lock" className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
