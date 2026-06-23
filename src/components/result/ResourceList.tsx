"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";
import { Icon } from "@/components/ui/Icon";
import { PLACEHOLDERS } from "@/lib/config/app.config";
import { trackFaqClicked } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

/** FAQ / documentation resource links with placeholder handling. */
export function ResourceList() {
  const { t, tx } = useLang();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PLACEHOLDERS.FAQ_LINKS.map((link, i) => {
        const hasUrl = Boolean(link.url);
        const Comp = hasUrl ? "a" : "div";
        return (
          <Comp
            key={i}
            {...(hasUrl
              ? {
                  href: link.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  onClick: () => trackFaqClicked(`faq:${i}`),
                }
              : {})}
            className={cn(
              "group flex items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-soft transition-all",
              hasUrl
                ? "border-navy/[0.07] hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
                : "border-dashed border-navy/15 bg-navy/[0.02]",
            )}
          >
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Icon name="BookOpen" className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-navy">{tx(link.label)}</span>
            </span>
            {hasUrl ? (
              <Icon
                name="ArrowRight"
                className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-brand"
              />
            ) : (
              <span className="text-xs font-medium text-ink-faint">
                {t("result.placeholderLink")}
              </span>
            )}
          </Comp>
        );
      })}
    </div>
  );
}
