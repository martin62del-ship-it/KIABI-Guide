import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "navy";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98] focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary:
    "sheen overflow-hidden text-white bg-brand-gradient shadow-glow-sm hover:shadow-glow hover:-translate-y-0.5",
  navy:
    "text-white bg-navy-gradient shadow-card hover:-translate-y-0.5 hover:shadow-lift",
  secondary:
    "text-navy bg-white shadow-soft ring-1 ring-navy/10 hover:ring-brand/30 hover:-translate-y-0.5 hover:shadow-card",
  outline:
    "text-brand bg-transparent ring-1.5 ring-brand/40 hover:bg-brand/5 hover:ring-brand/60",
  ghost: "text-ink-soft hover:text-navy hover:bg-navy/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <a
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
LinkButton.displayName = "LinkButton";
