"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Segmented + sweeping progress indicator for the questionnaire. */
export function StepProgress({
  current,
  total,
  className,
}: {
  current: number; // 1-based
  total: number;
  className?: string;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-navy/[0.07]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-gradient"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <span className="absolute inset-0 animate-shimmer bg-sheen" />
        </motion.div>
      </div>
    </div>
  );
}

/** A thin radial percentage ring (used in admin / result micro-stats). */
export function Ring({
  value,
  size = 56,
  stroke = 6,
  className,
  children,
}: {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(4,0,55,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#006EFB" />
            <stop offset="100%" stopColor="#00C2FF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-bold text-navy">
        {children ?? `${Math.round(value)}%`}
      </span>
    </div>
  );
}
