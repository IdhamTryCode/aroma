import Link from "next/link";
import type { Accord } from "@/lib/accords";
import { ACCORD_LABELS } from "@/lib/accords";
import type { Perfume } from "@/lib/perfumes";
import { findPerfume } from "@/lib/perfumes";
import type { RecommendResponse } from "@/lib/api";
import { SiteLogo } from "@/components/site-logo";
import { SiteFooter } from "@/components/site-footer";
import { ShareButton } from "@/components/share-button";

function topAccords(p: Perfume): Accord[] {
  return (Object.keys(p.accords) as Accord[])
    .filter((a) => (p.accords[a] ?? 0) >= 0.4)
    .sort((a, b) => (p.accords[b] ?? 0) - (p.accords[a] ?? 0))
    .slice(0, 4);
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1">
      <div className="mb-1 text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-aura" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
      {children}
    </span>
  );
}

export function Results({ data }: { data: RecommendResponse }) {
  const { profile, recommendations, explanation } = data;
  const whyById = new Map(explanation.picks.map((p) => [p.id, p.why]));

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
          <SiteLogo />
          <Link href="/quiz" className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            Ulangi kuis
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        {/* DNA summary */}
        <p className="text-sm font-semibold tracking-wide text-aura">DNA AROMA KAMU</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {explanation.dnaSummary}
        </h1>

        <div className="mt-5 flex flex-wrap gap-2">
          {profile.topAccords.map((a) => (
            <Chip key={a}>{ACCORD_LABELS[a]}</Chip>
          ))}
        </div>
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          {explanation.source === "ai"
            ? "🤖 Dianalisis oleh AI Aroma berdasarkan profilmu."
            : "Dicocokkan oleh mesin rekomendasi Aroma."}
        </p>
        {profile.anchors.length > 0 && (
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Berdasarkan kesukaanmu:{" "}
            {profile.anchors.map((id) => findPerfume(id)?.name).filter(Boolean).join(", ")}
          </p>
        )}

        {/* Recommendations */}
        <div className="mt-10 space-y-4">
          {recommendations.map((rec, i) => {
            const p = rec.perfume;
            const why = whyById.get(p.id) ?? rec.reasons.join(" ");
            return (
              <article key={p.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-aura text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {p.dupeOf && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                          Alternatif hemat
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">{p.brand}</p>
                    <h2 className="text-lg font-bold tracking-tight">
                      <Link href={`/parfum/${p.id}`} className="transition hover:text-primary">
                        {p.name}
                      </Link>
                    </h2>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-3xl font-extrabold text-aura">{rec.score}%</div>
                    <div className="text-[11px] font-medium text-muted-foreground">cocok</div>
                  </div>
                </div>

                {why && (
                  <p className="mt-4 rounded-2xl bg-accent px-4 py-3 text-sm font-medium leading-relaxed text-accent-foreground">
                    {why}
                  </p>
                )}

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {topAccords(p).map((a) => (
                    <Chip key={a}>{ACCORD_LABELS[a]}</Chip>
                  ))}
                </div>

                <div className="mt-5 flex items-end gap-4">
                  <Meter label="Tahan lama" value={p.longevity} />
                  <Meter label="Proyeksi" value={p.sillage} />
                  <div className="flex-1 text-right">
                    <div className="text-[11px] font-medium text-muted-foreground">Kisaran harga</div>
                    <div className="text-sm font-bold tracking-tight">{p.priceIDR}</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ShareButton />
          <Link
            href="/quiz"
            className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-bold text-foreground transition hover:scale-105 hover:border-primary/40 active:scale-95"
          >
            Ulangi kuis
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
