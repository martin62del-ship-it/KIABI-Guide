import * as React from "react";
import { cn } from "@/lib/utils";

/** Base premium surface. `interactive` adds hover lift + ring glow. */
export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-navy/[0.06] bg-white shadow-card",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-brand/20",
        className,
      )}
      {...props}
    />
  );
}

export function GlassCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("glass rounded-3xl border border-white/40", className)}
      {...props}
    />
  );
}
