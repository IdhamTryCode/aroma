"use client";

import { useState } from "react";
import Link from "next/link";
import { PERFUMES, findPerfume } from "@/lib/perfumes";
import { findDupes } from "@/lib/similarity";
import { SiteLogo } from "@/components/site-logo";
import { SiteFooter } from "@/components/site-footer";
import { PerfumePicker } from "@/components/perfume-picker";

const EXPENSIVE = PERFUMES.filter((p) => p.priceTier >= 3);
const TIER_MID: Record<number, number> = { 1: 250, 2: 400, 3: 1100, 4: 2000, 5: 5000 };

export function DupeFinder() {
  const [picked, setPicked] = useState<string[]>([]);
  const source = picked[0] ? findPerfume(picked[0]) : null;
  const dupes = source ? findDupes(source) : [];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
          <SiteLogo />
          <Link href="/quiz" className="rounded-full bg-aura px-5 py-2 text-sm font-bold text-white shadow-glow transition hover:scale-105 active:scale-95">
            Mulai kuis
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        <p className="text-sm font-bold tracking-wide text-aura">💸 DUPE FINDER</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Cari alternatif hemat</h1>
        <p className="mt-3 text-muted-foreground">
          Pilih parfum mahal yang kamu suka — kami carikan yang DNA aromanya paling mirip tapi lebih
          ramah kantong.
        </p>

        <div className="mt-8">
          <PerfumePicker
            value={picked}
            onChange={setPicked}
            max={1}
            candidates={EXPENSIVE}
            placeholder="Cari parfum mahal… (mis. Aventus)"
          />
        </div>

        {source && (
          <div className="mt-10">
            {dupes.length === 0 ? (
              <p className="rounded-2xl bg-secondary p-5 text-muted-foreground">
                Belum ada alternatif yang cukup mirip di katalog kami untuk parfum ini — nanti
                diperbanyak lewat data partner.
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Alternatif untuk{" "}
                  <span className="font-bold text-foreground">
                    {source.brand} {source.name}
                  </span>{" "}
                  ({source.priceIDR}):
                </p>
                <div className="mt-4 space-y-4">
                  {dupes.map((m) => {
                    const p = m.perfume;
                    const savings = Math.round((1 - TIER_MID[p.priceTier] / TIER_MID[source.priceTier]) * 100);
                    return (
                      <article key={p.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">{p.brand}</p>
                            <h2 className="text-lg font-bold tracking-tight">
                              <Link href={`/parfum/${p.id}`} className="transition hover:text-primary">
                                {p.name}
                              </Link>
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">{p.priceIDR}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-3xl font-extrabold text-aura">{Math.round(m.similarity * 100)}%</div>
                            <div className="text-[11px] font-medium text-muted-foreground">mirip DNA</div>
                          </div>
                        </div>
                        {savings > 0 && (
                          <span className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                            Hemat sekitar {savings}% 🎉
                          </span>
                        )}
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
