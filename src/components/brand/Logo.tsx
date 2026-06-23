import { cn } from "@/lib/utils";

/**
 * KIABI mark — a modern, on-brand digital interpretation of the KIABI
 * rounded-square marker (navy badge + stylised "K"). It is intentionally
 * NOT a pixel copy of the official logo, to avoid distorting brand assets.
 */
export function KiabiMark({
  className,
  withPulse = false,
}: {
  className?: string;
  withPulse?: boolean;
}) {
  return (
    <span className={cn("relative inline-flex", className)}>
      {withPulse && (
        <span className="pointer-events-none absolute inset-0 rounded-[28%] bg-brand/40 animate-pulse-ring" />
      )}
      <svg
        viewBox="0 0 64 64"
        className="relative h-full w-full"
        role="img"
        aria-label="KIABI"
      >
        <defs>
          <linearGradient id="kiabiBadge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0A0552" />
            <stop offset="100%" stopColor="#040037" />
          </linearGradient>
          <linearGradient id="kiabiK" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3FA9FF" />
            <stop offset="55%" stopColor="#006EFB" />
            <stop offset="100%" stopColor="#00C2FF" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#kiabiBadge)" />
        <rect
          x="2.75"
          y="2.75"
          width="58.5"
          height="58.5"
          rx="17.4"
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1.5"
        />
        {/* Stylised K */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 16 V48" stroke="#FFFFFF" strokeWidth="7" />
          <path d="M42 16 L26 32 L43 48" stroke="url(#kiabiK)" strokeWidth="7" />
          <circle cx="44.5" cy="16.5" r="3.4" fill="#00C2FF" stroke="none" />
        </g>
      </svg>
    </span>
  );
}

/**
 * Full lockup: mark + "KIABI AI Guide" wordmark.
 * `tone` adapts to light or dark backgrounds.
 */
export function KiabiLogo({
  className,
  tone = "navy",
  showSub = true,
}: {
  className?: string;
  tone?: "navy" | "white";
  showSub?: boolean;
}) {
  const text = tone === "white" ? "text-white" : "text-navy";
  const sub = tone === "white" ? "text-white/60" : "text-ink-muted";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <KiabiMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={cn("text-[1.15rem] font-extrabold tracking-tight", text)}>
          KIABI
          <span className="text-gradient font-extrabold"> AI Guide</span>
        </span>
        {showSub && (
          <span className={cn("mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em]", sub)}>
            Innovation &amp; IA Gen
          </span>
        )}
      </span>
    </span>
  );
}
