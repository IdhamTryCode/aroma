"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SURVEY, type SurveyAnswers } from "@/lib/survey";
import { SiteLogo } from "@/components/site-logo";
import { PerfumePicker } from "@/components/perfume-picker";
import { Slider } from "@/components/ui/slider";

const SCALE_DEFAULT = 2;

export function QuizFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = SURVEY[step];
  const isLast = step === SURVEY.length - 1;

  function setSingle(id: string) {
    setAnswers((a) => ({ ...a, [question.id]: id }));
  }

  function toggleMulti(id: string) {
    setAnswers((a) => {
      const current = (a[question.id] as string[] | undefined) ?? [];
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...a, [question.id]: next };
    });
  }

  function setScale(value: number) {
    setAnswers((a) => ({ ...a, [question.id]: value }));
  }

  function answered(): boolean {
    const value = answers[question.id];
    if (question.type === "scale" || question.type === "anchor") return true;
    if (question.type === "multi") return Array.isArray(value) && value.length > 0;
    return typeof value === "string" && value.length > 0;
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("gagal");
      const { id } = (await res.json()) as { id: string };
      router.push(`/hasil/${id}`);
    } catch {
      setError("Gagal meracik rekomendasi. Coba lagi ya.");
      setLoading(false);
    }
  }

  function next() {
    if (isLast) void submit();
    else setStep((s) => s + 1);
  }

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        <div>
          <p className="text-xl font-semibold tracking-tight">Meracik DNA aromamu…</p>
          <p className="mt-1 text-sm text-muted-foreground">Mencocokkan seleramu ke ratusan parfum.</p>
        </div>
      </div>
    );
  }

  const scaleValue = (answers[question.id] as number | undefined) ?? SCALE_DEFAULT;
  const multiValue = (answers[question.id] as string[] | undefined) ?? [];
  const anchorEmpty =
    question.type === "anchor" && ((answers[question.id] as string[] | undefined)?.length ?? 0) === 0;
  const progress = ((step + 1) / SURVEY.length) * 100;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-5 py-6">
      {/* Top: logo + progress */}
      <div className="flex items-center gap-3">
        <SiteLogo size={24} />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-aura transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold tabular-nums text-muted-foreground">
          {step + 1}/{SURVEY.length}
        </span>
      </div>

      {/* Question */}
      <div className="mt-10 flex-1">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{question.title}</h1>
        {question.subtitle && <p className="mt-2 text-[15px] text-muted-foreground">{question.subtitle}</p>}

        <div className="mt-8">
          {question.type === "anchor" ? (
            <PerfumePicker
              value={(answers[question.id] as string[]) ?? []}
              onChange={(ids) => setAnswers((a) => ({ ...a, [question.id]: ids }))}
              max={3}
              placeholder="Cari parfum yang kamu suka…"
            />
          ) : question.type === "scale" ? (
            <div className="pt-6">
              <Slider min={0} max={4} step={1} value={[scaleValue]} onValueChange={(v) => setScale(Array.isArray(v) ? v[0] : v)} />
              <div className="mt-4 flex justify-between text-sm font-medium text-muted-foreground">
                <span>{question.scale?.minLabel}</span>
                <span>{question.scale?.maxLabel}</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {question.options?.map((opt) => {
                const selected =
                  question.type === "multi" ? multiValue.includes(opt.id) : answers[question.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => (question.type === "multi" ? toggleMulti(opt.id) : setSingle(opt.id))}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left text-[15px] transition active:scale-[0.98] ${
                      selected
                        ? "border-primary bg-accent shadow-soft"
                        : "border-border bg-card hover:border-primary/40 hover:shadow-soft"
                    }`}
                  >
                    {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                    <span className="flex-1 font-semibold">{opt.label}</span>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-aura text-xs font-bold text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="sticky bottom-0 flex items-center justify-between gap-4 bg-background/80 py-5 backdrop-blur-xl">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            ← Kembali
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={next}
          disabled={!answered()}
          className="rounded-full bg-aura px-8 py-3 text-base font-bold text-white shadow-glow transition hover:scale-[1.03] active:scale-95 disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
        >
          {isLast ? "Lihat hasil" : anchorEmpty ? "Lewati" : "Lanjut"}
        </button>
      </div>

      {error && <p className="pb-4 text-center text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
