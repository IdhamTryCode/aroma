"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ACCORDS, ACCORD_LABELS, type Accord } from "@/lib/accords";
import { PERFUMES, type Gender, type Perfume } from "@/lib/perfumes";
import { SiteLogo } from "@/components/site-logo";
import { SiteFooter } from "@/components/site-footer";

const GENDERS: { id: Gender | "all"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "masc", label: "Pria" },
  { id: "fem", label: "Wanita" },
  { id: "uni", label: "Uniseks" },
];

const BUDGETS: { id: number; label: string }[] = [
  { id: 0, label: "Semua budget" },
  { id: 2, label: "< Rp600rb" },
  { id: 3, label: "< Rp1,5jt" },
  { id: 4, label: "< Rp3jt" },
];

function topAccords(p: Perfume): Accord[] {
  return (Object.keys(p.accords) as Accord[])
    .filter((a) => (p.accords[a] ?? 0) >= 0.4)
    .sort((a, b) => (p.accords[b] ?? 0) - (p.accords[a] ?? 0))
    .slice(0, 3);
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
        active ? "bg-aura text-white shadow-glow" : "border border-border bg-card text-foreground hover:border-primary/30"
      }`}
    >
      {children}
    </button>
  );
}

export function Catalog() {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<Gender | "all">("all");
  const [maxTier, setMaxTier] = useState(0);
  const [accord, setAccord] = useState<Accord | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PERFUMES.filter((p) => {
      if (gender !== "all" && p.gender !== gender) return false;
      if (maxTier && p.priceTier > maxTier) return false;
      if (accord !== "all" && (p.accords[accord] ?? 0) < 0.3) return false;
      if (q && !`${p.brand} ${p.name}`.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
  }, [query, gender, maxTier, accord]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <SiteLogo />
          <Link href="/quiz" className="rounded-full bg-aura px-5 py-2 text-sm font-bold text-white shadow-glow transition hover:scale-105 active:scale-95">
            Mulai kuis
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Katalog <span className="text-aura">parfum</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Jelajahi {PERFUMES.length} parfum. Cari, filter, dan klik untuk lihat DNA-nya.
        </p>

        {/* Filters */}
        <div className="mt-8 space-y-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau brand… (mis. Dior, Aventus)"
            className="w-full rounded-2xl border-2 border-border bg-card px-5 py-3.5 text-[15px] font-medium outline-none transition focus:border-primary/40"
          />
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <Chip key={g.id} active={gender === g.id} onClick={() => setGender(g.id)}>
                {g.label}
              </Chip>
            ))}
            <span className="mx-1 self-center text-border">|</span>
            {BUDGETS.map((b) => (
              <Chip key={b.id} active={maxTier === b.id} onClick={() => setMaxTier(b.id)}>
                {b.label}
              </Chip>
            ))}
          </div>
          <select
            value={accord}
            onChange={(e) => setAccord(e.target.value as Accord | "all")}
            className="rounded-full border-2 border-border bg-card px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-primary/40"
          >
            <option value="all">Semua accord</option>
            {ACCORDS.map((a) => (
              <option key={a} value={a}>
                {ACCORD_LABELS[a]}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-8 text-sm font-semibold text-muted-foreground">{results.length} parfum</p>

        {/* Grid */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/parfum/${p.id}`}
              className="rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:border-primary/30"
            >
              <p className="text-xs font-medium text-muted-foreground">{p.brand}</p>
              <h2 className="mt-0.5 font-bold tracking-tight">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.priceIDR}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {topAccords(p).map((a) => (
                  <span key={a} className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                    {ACCORD_LABELS[a]}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {results.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">
            Nggak ada yang cocok dengan filter ini. Coba longgarkan filternya.
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
