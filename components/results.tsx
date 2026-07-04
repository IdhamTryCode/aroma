import Link from "next/link";
import type { Accord } from "@/lib/accords";
import { ACCORD_LABELS } from "@/lib/accords";
import type { Perfume } from "@/lib/perfumes";
import { findPerfume } from "@/lib/perfumes";
import type { RecommendResponse } from "@/lib/api";
import { ShareButton } from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function topAccords(p: Perfume): Accord[] {
  return (Object.keys(p.accords) as Accord[])
    .filter((a) => (p.accords[a] ?? 0) >= 0.4)
    .sort((a, b) => (p.accords[b] ?? 0) - (p.accords[a] ?? 0))
    .slice(0, 4);
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1">
      <div className="mb-1 text-[11px] text-muted-foreground">{label}</div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-foreground/70" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

export function Results({ data }: { data: RecommendResponse }) {
  const { profile, recommendations, explanation } = data;
  const whyById = new Map(explanation.picks.map((p) => [p.id, p.why]));

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      {/* DNA summary */}
      <p className="text-sm font-medium tracking-tight text-primary">DNA Aroma Kamu</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        {explanation.dnaSummary}
      </h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {profile.topAccords.map((a) => (
          <Badge key={a} variant="secondary" className="rounded-full px-3 py-1 text-xs font-normal">
            {ACCORD_LABELS[a]}
          </Badge>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        {explanation.source === "ai"
          ? "Dianalisis oleh AI Aroma berdasarkan profilmu."
          : "Dicocokkan oleh mesin rekomendasi Aroma."}
      </p>
      {profile.anchors.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          Berdasarkan kesukaanmu:{" "}
          {profile.anchors
            .map((id) => findPerfume(id)?.name)
            .filter(Boolean)
            .join(", ")}
        </p>
      )}

      {/* Recommendations */}
      <div className="mt-12 space-y-4">
        {recommendations.map((rec, i) => {
          const p = rec.perfume;
          const why = whyById.get(p.id) ?? rec.reasons.join(" ");
          return (
            <article key={p.id} className="rounded-[18px] border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{i + 1}</span>
                    {p.dupeOf && (
                      <Badge variant="secondary" className="rounded-full text-[10px]">
                        Alternatif hemat
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.brand}</p>
                  <h2 className="text-lg font-semibold tracking-tight">
                    <Link href={`/parfum/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tracking-tight text-primary">{rec.score}%</div>
                  <div className="text-[11px] text-muted-foreground">cocok</div>
                </div>
              </div>

              {why && (
                <p className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-secondary-foreground">
                  {why}
                </p>
              )}

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {topAccords(p).map((a) => (
                  <Badge key={a} variant="outline" className="rounded-full text-[11px] font-normal">
                    {ACCORD_LABELS[a]}
                  </Badge>
                ))}
              </div>

              <div className="mt-5 flex items-end gap-4">
                <Meter label="Tahan lama" value={p.longevity} />
                <Meter label="Proyeksi" value={p.sillage} />
                <div className="flex-1 text-right">
                  <div className="text-[11px] text-muted-foreground">Kisaran harga</div>
                  <div className="text-sm font-medium tracking-tight">{p.priceIDR}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <ShareButton />
        <Button
          render={<Link href="/quiz" />}
          nativeButton={false}
          variant="outline"
          className="rounded-full px-6"
        >
          Ulangi kuis
        </Button>
      </div>
    </div>
  );
}
