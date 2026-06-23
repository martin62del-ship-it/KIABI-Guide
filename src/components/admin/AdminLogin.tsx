"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { Aurora } from "@/components/background/Aurora";
import { KiabiLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ADMIN } from "@/lib/config/app.config";

export function AdminLogin() {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState<string>(ADMIN.allowedEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-dvh place-items-center px-6 py-10">
      <Aurora />
      <div className="absolute right-6 top-6 z-10 flex items-center gap-3">
        <LanguageSwitcher />
        <Link
          href="/"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-ink-muted ring-1 ring-navy/10 backdrop-blur transition-colors hover:text-navy"
          aria-label={t("common.backHome")}
        >
          <Icon name="ArrowLeft" className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <KiabiLogo />
        </div>
        <div className="gradient-ring rounded-3xl">
          <div className="rounded-3xl border border-white/50 bg-white/80 p-8 shadow-lift backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy-gradient text-white">
                <Icon name="Lock" className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-navy">
                  {t("admin.loginTitle")}
                </h1>
                <p className="text-sm text-ink-muted">{t("admin.loginSubtitle")}</p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label={t("admin.email")}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none transition-shadow focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
                />
              </Field>
              <Field label={t("admin.password")}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none transition-shadow focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
                />
              </Field>

              {error && (
                <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600">
                  {t("admin.loginError")}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("common.loading") : t("admin.login")}
                {!loading && <Icon name="ArrowRight" className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-5 rounded-xl bg-brand/[0.06] px-4 py-3 text-center text-xs text-ink-muted">
              {t("admin.demoHint")}
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
