import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KIABI brand tokens
        navy: {
          DEFAULT: "#040037",
          50: "#F4F5FB",
          100: "#E6E7F4",
          200: "#C5C7E3",
          300: "#9A9DC9",
          400: "#5B5E8F",
          600: "#0A0552",
          700: "#070140",
          900: "#040037",
        },
        brand: {
          // service / accent blue
          DEFAULT: "#006EFB",
          50: "#EAF3FF",
          100: "#D3E6FF",
          200: "#A6CCFF",
          300: "#6BA8FF",
          400: "#3B8BFF",
          500: "#006EFB",
          600: "#0057D6",
          700: "#0046AE",
          glow: "#3FA9FF",
          cyan: "#00C2FF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F9FF",
          muted: "#EEF3FF",
        },
        ink: {
          DEFAULT: "#040037",
          soft: "#3B3F63",
          muted: "#6B6F8C",
          faint: "#9A9DB5",
        },
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(4,0,55,0.04), 0 8px 24px -12px rgba(4,0,55,0.12)",
        card: "0 2px 4px rgba(4,0,55,0.04), 0 18px 40px -20px rgba(4,0,55,0.22)",
        lift: "0 8px 16px rgba(4,0,55,0.06), 0 30px 60px -24px rgba(4,0,55,0.28)",
        glow: "0 0 0 1px rgba(0,110,251,0.15), 0 20px 50px -16px rgba(0,110,251,0.45)",
        "glow-sm": "0 10px 30px -12px rgba(0,110,251,0.5)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #006EFB 0%, #00C2FF 100%)",
        "navy-gradient": "linear-gradient(150deg, #0A0552 0%, #040037 60%, #02001F 100%)",
        "aurora": "radial-gradient(60% 60% at 20% 20%, rgba(0,110,251,0.18) 0%, transparent 60%), radial-gradient(50% 50% at 80% 0%, rgba(0,194,255,0.16) 0%, transparent 55%), radial-gradient(60% 60% at 90% 80%, rgba(63,169,255,0.14) 0%, transparent 60%)",
        "sheen": "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.6) 45%, transparent 70%)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(0,-24px,0) scale(1.05)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(16px,18px,0) scale(1.08)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float-slow": "float-slow 9s ease-in-out infinite",
        "float-slower": "float-slower 13s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.2,0.6,0.3,1) infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "fade-up": "fade-up 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
