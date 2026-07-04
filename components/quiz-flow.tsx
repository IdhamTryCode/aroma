"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SURVEY, type SurveyAnswers } from "@/lib/survey";
import { PerfumePicker } from "@/components/perfume-picker";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    if (question.type === "scale" || question.type === "anchor") return true; // punya default / opsional
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
      router.push(`/hasil/${id}`); // biarkan spinner sampai halaman hasil termuat
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
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-lg font-medium tracking-tight">Meracik DNA aromamu…</p>
        <p className="text-sm text-muted-foreground">Mencocokkan seleramu ke ribuan kemungkinan.</p>
      </div>
    );
  }

  const scaleValue = (answers[question.id] as number | undefined) ?? SCALE_DEFAULT;
  const multiValue = (answers[question.id] as string[] | undefined) ?? [];
  const anchorEmpty =
    question.type === "anchor" && ((answers[question.id] as string[] | undefined)?.length ?? 0) === 0;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-6 py-8">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ✕
        </Link>
        <Progress value={((step + 1) / SURVEY.length) * 100} className="h-1 flex-1" />
        <span className="text-xs tabular-nums text-muted-foreground">
          {step + 1}/{SURVEY.length}
        </span>
      </div>

      {/* Question */}
      <div className="mt-12 flex-1">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          {question.title}
        </h1>
        {question.subtitle && (
          <p className="mt-2 text-[15px] text-muted-foreground">{question.subtitle}</p>
        )}

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
              <Slider
                min={0}
                max={4}
                step={1}
                value={[scaleValue]}
                onValueChange={(v) => setScale(Array.isArray(v) ? v[0] : v)}
              />
              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>{question.scale?.minLabel}</span>
                <span>{question.scale?.maxLabel}</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {question.options?.map((opt) => {
                const selected =
                  question.type === "multi"
                    ? multiValue.includes(opt.id)
                    : answers[question.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      question.type === "multi" ? toggleMulti(opt.id) : setSingle(opt.id)
                    }
                    className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-left text-[15px] transition active:scale-[0.99] ${
                      selected
                        ? "border-primary bg-primary/[0.04] ring-1 ring-primary"
                        : "border-border bg-card hover:border-foreground/30"
                    }`}
                  >
                    {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
                    <span className="flex-1 font-medium">{opt.label}</span>
                    {selected && <span className="text-primary">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="sticky bottom-0 flex items-center justify-between gap-4 bg-background py-6">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="rounded-full">
            Kembali
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={next} disabled={!answered()} className="rounded-full px-8">
          {isLast ? "Lihat hasil" : anchorEmpty ? "Lewati" : "Lanjut"}
        </Button>
      </div>

      {error && <p className="pb-4 text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
