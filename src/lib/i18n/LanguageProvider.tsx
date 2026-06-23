"use client";

// =====================================================================
// Language context — client-side bilingual support (FR default).
// Persists choice to localStorage + cookie so the server can read it too.
// =====================================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Lang, Localized } from "@/lib/config/types";
import { tPath } from "@/lib/config/translations";
import { trackLanguageSwitch } from "@/lib/analytics/client";

const STORAGE_KEY = "kiabi-ai-guide.lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Translate a dotted dictionary path. */
  t: (path: string) => string;
  /** Localise a `Localized<T>` value inline. */
  tx: <T>(value: Localized<T>) => T;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLang(): Lang {
  if (typeof document === "undefined") return "fr";
  const fromCookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${STORAGE_KEY}=`))
    ?.split("=")[1];
  if (fromCookie === "fr" || fromCookie === "en") return fromCookie;
  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (fromStorage === "fr" || fromStorage === "en") return fromStorage;
  return "fr";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  // Hydrate from persisted preference once mounted.
  useEffect(() => {
    setLangState(readInitialLang());
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState((prev) => {
      if (prev !== next) trackLanguageSwitch(next);
      return next;
    });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = next;
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "fr" ? "en" : "fr");
  }, [lang, setLang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle,
      t: (path: string) => tPath(path, lang),
      tx: <T,>(v: Localized<T>) => v[lang],
    }),
    [lang, setLang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
