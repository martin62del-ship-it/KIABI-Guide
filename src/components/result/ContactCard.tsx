"use client";

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
  const initials = contact.name
    ? contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "·";
  const href = contact.url || (contact.email ? `mailto:${contact.email}` : "");
  const hasContact = Boolean(href);

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
          {hasContact ? (
            <LinkButton
              href={href}
              target={contact.url ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => trackContactClicked(analyticsKey)}
            >
              {t("result.contactVia")}
              <Icon name={contact.email && !contact.url ? "Mail" : "ExternalLink"} className="h-4 w-4" />
            </LinkButton>
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
