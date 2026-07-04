"use client";

import { useState } from "react";
import Link from "next/link";
import { PERFUMES, findPerfume } from "@/lib/perfumes";
import { findDupes } from "@/lib/similarity";
import { PerfumePicker } from "@/components/perfume-picker";
import { Badge } from "@/components/ui/badge";

const EXPENSIVE = PERFUMES.filter((p) => p.priceTier >= 3);
// Titik tengah harga per tier (ribuan rupiah) — hanya untuk estimasi "hemat".
const TIER_MID: Record<number, number> = { 1: 250, 2: 400, 3: 1100, 4: 2000, 5: 5000 };

export function DupeFinder() {
  const [picked, setPicked] = useState<string[]>([]);
  const source = picked[0] ? findPerfume(picked[0]) : null;
  const dupes = source ? findDupes(source) : [];

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Aroma
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        Cari alternatif hemat
      </h1>
      <p className="mt-3 text-muted-foreground">
        Pilih parfum mahal yang kamu suka — kami carikan yang DNA aromanya paling mirip tapi
        lebih ramah kantong.
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
            <p className="text-muted-foreground">
              Belum ada alternatif yang cukup mirip di katalog seed kami untuk parfum ini —
              nanti diperbanyak lewat data partner.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Alternatif untuk{" "}
                <span className="font-medium text-foreground">
                  {source.brand} {source.name}
                </span>{" "}
                ({source.priceIDR}):
              </p>
              <div className="mt-4 space-y-4">
                {dupes.map((m) => {
                  const p = m.perfume;
                  const savings = Math.round(
                    (1 - TIER_MID[p.priceTier] / TIER_MID[source.priceTier]) * 100,
                  );
                  return (
                    <article key={p.id} className="rounded-[18px] border border-border bg-card p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">{p.brand}</p>
                          <h2 className="text-lg font-semibold tracking-tight">
                            <Link href={`/parfum/${p.id}`} className="hover:underline">
                              {p.name}
                            </Link>
                          </h2>
                          <p className="mt-1 text-sm text-muted-foreground">{p.priceIDR}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-semibold tracking-tight text-primary">
                            {Math.round(m.similarity * 100)}%
                          </div>
                          <div className="text-[11px] text-muted-foreground">mirip DNA</div>
                        </div>
                      </div>
                      {savings > 0 && (
                        <Badge variant="secondary" className="mt-3 rounded-full">
                          Hemat sekitar {savings}%
                        </Badge>
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
    </div>
  );
}
