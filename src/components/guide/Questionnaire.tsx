"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { QUESTIONS } from "@/lib/config/questions";
import { recommend, visibleQuestions, type AnswersMap } from "@/lib/engine/recommend";
import { ID_TO_SLUG, RESULT_STORAGE_KEY } from "@/lib/engine/slug";
import { StepProgress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AnswerCard } from "./AnswerCard";
import { Aurora } from "@/components/background/Aurora";
import { KiabiMark } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import {
  trackJourneyStarted,
  trackQuestionViewed,
  trackAnswerSelected,
  trackPreviousClicked,
  trackJourneyAbandoned,
  trackJourneyCompleted,
} from "@/lib/analytics/client";
import Link from "next/link";

export function Questionnaire() {
  const { t, tx } = useLang();
  const router = useRouter();

  const [answers, setAnswers] = useState<AnswersMap>({});
  const [currentId, setCurrentId] = useState<string>(QUESTIONS[0].id);
  const [direction, setDirection] = useState<1 | -1>(1);

  const completedRef = useRef(false);
  const startedRef = useRef(false);

  const visible = useMemo(() => visibleQuestions(answers), [answers]);
  const currentIndex = Math.max(0, visible.findIndex((q) => q.id === currentId));
  const current = visible[currentIndex] ?? visible[0];
  const total = visible.length;

  const selected = answers[current.id] ?? [];
  const canContinue = !current.required || selected.length > 0;

  // Journey start (once)
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackJourneyStarted();
    }
  }, []);

  // Track question views + guard against a stale currentId after branching.
  useEffect(() => {
    if (!visible.some((q) => q.id === currentId)) {
      setCurrentId(visible[Math.min(currentIndex, visible.length - 1)].id);
      return;
    }
    trackQuestionViewed(current.id, currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id]);

  // Abandonment tracking on unmount (unless we completed the journey).
  useEffect(() => {
    return () => {
      if (!completedRef.current) trackJourneyAbandoned(currentId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNext = useCallback(
    (nextAnswers: AnswersMap) => {
      const nextVisible = visibleQuestions(nextAnswers);
      const idx = nextVisible.findIndex((q) => q.id === current.id);
      if (idx >= 0 && idx < nextVisible.length - 1) {
        setDirection(1);
        setCurrentId(nextVisible[idx + 1].id);
      } else {
        finish(nextAnswers);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current.id],
  );

  const finish = useCallback(
    (finalAnswers: AnswersMap) => {
      const result = recommend(finalAnswers);
      completedRef.current = true;
      try {
        sessionStorage.setItem(
          RESULT_STORAGE_KEY,
          JSON.stringify({ ...result, answers: finalAnswers, at: Date.now() }),
        );
      } catch {
        /* ignore storage errors */
      }
      trackJourneyCompleted(result.primary);
      router.push(`/result/${ID_TO_SLUG[result.primary]}`);
    },
    [router],
  );

  const handleSelect = useCallback(
    (answerId: string) => {
      if (current.multiple) {
        const set = new Set(answers[current.id] ?? []);
        if (set.has(answerId)) set.delete(answerId);
        else set.add(answerId);
        setAnswers((a) => ({ ...a, [current.id]: [...set] }));
        trackAnswerSelected(current.id, answerId);
      } else {
        const next: AnswersMap = { ...answers, [current.id]: [answerId] };
        setAnswers(next);
        trackAnswerSelected(current.id, answerId);
        // brief highlight, then advance
        window.setTimeout(() => goNext(next), 360);
      }
    },
    [answers, current.id, current.multiple, goNext],
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      trackPreviousClicked(current.id);
      setCurrentId(visible[currentIndex - 1].id);
    } else {
      router.push("/");
    }
  }, [currentIndex, visible, current.id, router]);

  const handleContinue = useCallback(() => {
    if (canContinue) goNext(answers);
  }, [answers, canContinue, goNext]);

  const isLast = currentIndex === total - 1;

  return (
    <main className="relative flex min-h-dvh flex-col">
      <Aurora />

      {/* Slim header */}
      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="KIABI AI Guide">
          <KiabiMark className="h-8 w-8" />
          <span className="text-sm font-extrabold tracking-tight text-navy">
            KIABI<span className="text-gradient"> AI Guide</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => {
              if (window.confirm(t("guide.quitConfirm"))) router.push("/");
            }}
            className="text-sm font-medium text-ink-muted transition-colors hover:text-navy"
          >
            {t("guide.quit")}
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 mx-auto mt-8 w-full max-w-3xl px-6">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-muted">
          <span>
            {t("guide.progress")} {currentIndex + 1} {t("guide.of")} {total}
          </span>
          <span>{Math.round(((currentIndex + 1) / total) * 100)}%</span>
        </div>
        <StepProgress current={currentIndex + 1} total={total} />
      </div>

      {/* Question */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col"
          >
            {current.eyebrow && (
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                {tx(current.eyebrow)}
              </span>
            )}
            <h1 className="mt-3 text-balance text-2xl font-extrabold leading-tight tracking-tight text-navy sm:text-3xl">
              {tx(current.title)}
            </h1>
            {current.subtitle && (
              <p className="mt-2 text-ink-soft">{tx(current.subtitle)}</p>
            )}
            <p className="mt-1 text-xs font-medium text-ink-faint">
              {current.multiple ? t("guide.selectMultiHint") : t("guide.selectHint")}
            </p>

            <div className="mt-6 grid gap-3">
              {current.options.map((opt, i) => (
                <AnswerCard
                  key={opt.id}
                  option={opt}
                  index={i}
                  multiple={current.multiple}
                  selected={selected.includes(opt.id)}
                  onSelect={() => handleSelect(opt.id)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" size="md" onClick={handleBack}>
            <Icon name="ArrowLeft" className="h-4 w-4" />
            {t("guide.back")}
          </Button>

          {/* Continue shown for multi-select or to confirm the last step */}
          {(current.multiple || isLast) && (
            <Button size="md" onClick={handleContinue} disabled={!canContinue}>
              {isLast ? t("guide.seeResult") : t("guide.next")}
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
