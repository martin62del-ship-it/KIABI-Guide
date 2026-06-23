import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "navy" | "violet" | "amber" | "emerald" | "slate" | "soft";

const tones: Record<Tone, string> = {
  brand: "bg-brand/10 text-brand ring-brand/20",
  navy: "bg-navy/[0.06] text-navy ring-navy/15",
  violet: "bg-violet-500/10 text-violet-600 ring-violet-500/20",
  amber: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
  slate: "bg-slate-500/10 text-slate-600 ring-slate-500/20",
  soft: "bg-white/70 text-ink-soft ring-navy/10 backdrop-blur",
};

export function Badge({
  className,
  tone = "brand",
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
