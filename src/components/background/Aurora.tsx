import { cn } from "@/lib/utils";

/**
 * Soft floating gradient blobs — the signature ambient background.
 * Pure CSS, GPU-friendly, respects reduced-motion (animation disabled there).
 */
export function Aurora({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {tone === "dark" && <div className="absolute inset-0 bg-navy-gradient" />}
      <div
        className={cn(
          "absolute -left-24 -top-24 h-[34rem] w-[34rem] rounded-full blur-3xl animate-float-slow",
          tone === "light" ? "bg-brand/20" : "bg-brand/30",
        )}
      />
      <div
        className={cn(
          "absolute -right-16 top-10 h-[28rem] w-[28rem] rounded-full blur-3xl animate-float-slower",
          tone === "light" ? "bg-brand-cyan/20" : "bg-brand-cyan/25",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full blur-3xl animate-float-slow",
          tone === "light" ? "bg-brand-glow/15" : "bg-brand/20",
        )}
        style={{ animationDelay: "-3s" }}
      />
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(4,0,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(4,0,55,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 80%)",
        }}
      />
    </div>
  );
}
