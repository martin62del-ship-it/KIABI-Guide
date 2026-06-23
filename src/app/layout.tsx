import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "KIABI AI Guide — Trouvez le bon accompagnement IA",
  description:
    "Outil interne d'orientation KIABI. Trouvez en moins d'une minute le dispositif d'innovation le plus adapté à votre besoin : Easy IA, Easy Microsoft, GEN IA Factory et plus.",
  applicationName: "KIABI AI Guide",
  authors: [{ name: "Innovation & IA Gen — KIABI" }],
  robots: { index: false, follow: false }, // internal tool
};

export const viewport: Viewport = {
  themeColor: "#040037",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={figtree.variable}>
      <body className="font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
