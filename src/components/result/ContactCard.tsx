"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ContactPlaceholder } from "@/lib/config/app.config";
import { trackContactClicked } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

/**
 * Contact CTA with graceful placeholder handling. Used for GEN IA Factory
 * (Younes), External tool (Justine) and the generic innovation contact.
 *
 * Behaviour:
 *  - if `url` is set      → a "Get in touch" button (opens the link)
 *  - else if `email` set  → the email shown as copyable text (no mailto, so
 *                            nothing auto-launches Outlook — the employee
 *                            copies it and writes from wherever they like)
 *  - else                 → a "to be completed" placeholder badge
 */
export function ContactCard({
  contact,
  analyticsKey,
  accentClass = "bg-navy-gradient",
}: {
  contact: ContactPlaceholder;
  analyticsKey: string;
  accentClass?: string;
}) {
  const { t, tx } = useLang();
  const [copied, setCopied] = useState(false);

  const initials = contact.name
    ? contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "·";
  const hasUrl = Boolean(contact.url);
  const hasEmail = Boolean(contact.email);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      trackContactClicked(analyticsKey);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the address stays selectable as text */
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-navy/[0.07] bg-white p-6 shadow-card sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white shadow-glow-sm",
              accentClass,
            )}
          >
            {initials}
          </span>
          <div>
            <h3 className="text-lg font-bold text-navy">
              {contact.name || t("result.contactVia")}
            </h3>
            <p className="mt-0.5 max-w-md text-sm text-ink-muted">{tx(contact.note)}</p>
          </div>
        </div>

        <div className="shrink-0">
          {hasUrl ? (
            <LinkButton
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClicked(analyticsKey)}
            >
              {t("result.contactVia")}
              <Icon name="ExternalLink" className="h-4 w-4" />
            </LinkButton>
          ) : hasEmail ? (
            <div className="flex items-center gap-2 rounded-2xl border border-navy/10 bg-surface-soft p-1.5 pl-3">
              <Icon name="Mail" className="h-4 w-4 shrink-0 text-brand" />
              <span className="min-w-0 select-all break-all text-sm font-semibold text-navy">
                {contact.email}
              </span>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={t("result.copyEmail")}
                title={copied ? t("result.copied") : t("result.copyEmail")}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-ink-muted ring-1 ring-navy/10 transition-colors hover:text-brand"
              >
                <Icon name={copied ? "Check" : "Copy"} className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Badge tone="amber" className="normal-case">
              <Icon name="Mail" className="h-3.5 w-3.5" />
              {t("result.placeholderContact")}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
