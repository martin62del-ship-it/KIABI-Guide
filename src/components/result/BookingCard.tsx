"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { BookingContact } from "@/lib/config/types";
import { trackBookingClicked } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

/** Equal-weight agenda card for Easy IA / Easy Microsoft experts. */
export function BookingCard({
  contact,
  index = 0,
  highlight = false,
}: {
  contact: BookingContact;
  index?: number;
  highlight?: boolean;
}) {
  const { t, tx } = useLang();
  const hasUrl = Boolean(contact.url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        highlight ? "border-brand/30" : "border-navy/[0.07]",
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-navy-gradient text-lg font-extrabold text-white shadow-glow-sm">
          {contact.initials}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-navy">{contact.name}</h3>
          <p className="truncate text-sm text-ink-muted">{tx(contact.role)}</p>
        </div>
      </div>

      <div className="relative mt-4">
        <Badge tone="brand" className="normal-case">
          <Icon name="Calendar" className="h-3.5 w-3.5" />
          {tx(contact.availability)}
        </Badge>
      </div>

      <p className="relative mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
        {tx(contact.description)}
      </p>

      <div className="relative mt-6">
        {hasUrl ? (
          <LinkButton
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClicked(contact.analyticsKey)}
            className="w-full"
          >
            {t("result.book")}
            <Icon name="ExternalLink" className="h-4 w-4" />
          </LinkButton>
        ) : (
          <div className="rounded-full border border-dashed border-navy/15 bg-navy/[0.02] px-4 py-3 text-center text-xs font-medium text-ink-muted">
            {t("result.placeholderLink")}
          </div>
        )}
      </div>
    </motion.div>
  );
}
