import type { Accord, AccordVector } from "./accords";

/**
 * Cosine similarity dua vektor accord. Bisa negatif bila ada preferensi "benci".
 * Dipakai bersama oleh scoring (target user ↔ parfum) dan similarity (parfum ↔ parfum).
 */
export function cosine(a: AccordVector, b: AccordVector): number {
  const keys = new Set<Accord>([
    ...(Object.keys(a) as Accord[]),
    ...(Object.keys(b) as Accord[]),
  ]);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const k of keys) {
    const va = a[k] ?? 0;
    const vb = b[k] ?? 0;
    dot += va * vb;
    normA += va * va;
    normB += vb * vb;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
