import type { Perfume } from "./perfumes";
import { PERFUMES } from "./perfumes";
import { cosine } from "./vector";

// ============================================================================
// Item-to-item similarity berbasis DNA (vektor accord). Fondasi dua fitur:
// - similarPerfumes: "yang mirip dengan ini" (dipakai anchor perfume nanti).
// - findDupes: alternatif LEBIH MURAH dengan DNA paling mirip (wedge Indonesia).
// ============================================================================

export interface SimilarMatch {
  perfume: Perfume;
  /** 0..1 kemiripan DNA. */
  similarity: number;
}

function rank(source: Perfume, pool: Perfume[], limit: number): SimilarMatch[] {
  return pool
    .filter((p) => p.id !== source.id)
    .map((p) => ({ perfume: p, similarity: cosine(source.accords, p.accords) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/** Parfum paling mirip DNA-nya, dari seluruh katalog. */
export function similarPerfumes(source: Perfume, limit = 5): SimilarMatch[] {
  return rank(source, PERFUMES, limit);
}

/**
 * Alternatif lebih murah yang mirip. Utamakan tier harga lebih rendah; kalau
 * sumbernya sudah murah, longgarkan ke tier sama. Saring kemiripan minimal.
 */
export function findDupes(source: Perfume, limit = 5): SimilarMatch[] {
  const cheaper = PERFUMES.filter((p) => p.priceTier < source.priceTier);
  const pool = cheaper.length > 0 ? cheaper : PERFUMES.filter((p) => p.priceTier <= source.priceTier);
  return rank(source, pool, limit).filter((m) => m.similarity >= 0.5);
}
