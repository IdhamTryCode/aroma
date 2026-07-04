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
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
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
            className="w-full rounded-full border border-border bg-card px-5 py-3 text-[15px] outline-none focus:border-foreground/30"
          />
          {matches.length > 0 && (
            <div className="mt-2 grid gap-1.5">
              {matches.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => add(p.id)}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition hover:border-foreground/30"
                >
                  <span>
                    <span className="text-muted-foreground">{p.brand}</span> {p.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{p.priceIDR}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
