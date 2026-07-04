"use client";

import { useState } from "react";
import type { Perfume } from "@/lib/perfumes";
import { PERFUMES, findPerfume } from "@/lib/perfumes";

/** Pemilih parfum dengan pencarian. Dipakai anchor (max 3) & dupe finder (max 1). */
export function PerfumePicker({
  value,
  onChange,
  max = 3,
  candidates = PERFUMES,
  placeholder = "Cari parfum…",
}: {
  value: string[];
  onChange: (ids: string[]) => void;
  max?: number;
  candidates?: Perfume[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const atMax = value.length >= max;

  const matches = candidates
    .filter((p) => !value.includes(p.id))
    .filter((p) => `${p.brand} ${p.name}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  function add(id: string) {
    if (atMax) return;
    onChange([...value, id]);
    setQuery("");
  }

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((id) => {
            const p = findPerfume(id);
            if (!p) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(value.filter((x) => x !== id))}
                className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-accent-foreground transition active:scale-95"
              >
                {p.brand} {p.name}
                <span className="text-muted-foreground">×</span>
              </button>
            );
          })}
        </div>
      )}

      {!atMax && (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border-2 border-border bg-card px-5 py-3.5 text-[15px] font-medium outline-none transition focus:border-primary/40"
          />
          {matches.length > 0 && (
            <div className="mt-2 grid gap-2">
              {matches.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => add(p.id)}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm transition hover:border-primary/30 hover:shadow-soft"
                >
                  <span className="font-semibold">
                    <span className="text-muted-foreground">{p.brand}</span> {p.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{p.priceIDR}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
