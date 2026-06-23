"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { AnswerOption } from "@/lib/config/types";
import { useLang } from "@/lib/i18n/LanguageProvider";

export function AnswerCard({
  option,
  selected,
  multiple,
  index,
  onSelect,
}: {
  option: AnswerOption;
  selected: boolean;
  multiple?: boolean;
  index: number;
  onSelect: () => void;
}) {
  const { tx } = useLang();
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border bg-white p-4 text-left shadow-soft transition-colors duration-200 sm:p-5",
        selected
          ? "border-brand/50 ring-2 ring-brand/30"
          : "border-navy/[0.07] hover:border-brand/30",
      )}
    >
      {/* selected wash */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/[0.06] to-transparent transition-opacity duration-300",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-60",
        )}
      />

      <span
        className={cn(
          "relative grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-all duration-300",
          selected
            ? "bg-brand-gradient text-white shadow-glow-sm"
            : "bg-navy/[0.04] text-navy group-hover:bg-brand/10 group-hover:text-brand",
        )}
      >
        <Icon name={option.icon} className="h-5 w-5" />
      </span>

      <span className="relative min-w-0 flex-1">
        <span className="block font-semibold text-navy">{tx(option.label)}</span>
        {option.hint && (
          <span className="mt-0.5 block text-sm text-ink-muted">{tx(option.hint)}</span>
        )}
      </span>

      {/* selection indicator */}
      <span
        className={cn(
          "relative grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-200",
          multiple ? "rounded-md" : "rounded-full",
          selected ? "border-brand bg-brand text-white" : "border-navy/15 text-transparent",
        )}
      >
        <Icon name="Check" className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </motion.button>
  );
}
