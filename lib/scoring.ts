import { ACCORD_LABELS } from "./accords";
import { cosine } from "./vector";
import type { Perfume } from "./perfumes";
import { PERFUMES, findPerfume } from "./perfumes";
import type { SurveyProfile } from "./survey";

// ============================================================================
// Scoring: cocokkan target DNA user ke knowledge base.
// Hard filter (budget) → skor gabungan (accord + manis + kekuatan + gender +
// iklim) → urutkan. Iklim = nudge untuk cuaca panas-lembab Indonesia.
// ============================================================================

export interface ScoreBreakdown {
  accord: number;
  sweetness: number;
  strength: number;
  gender: number;
  climate: number;
}

export interface Recommendation {
  perfume: Perfume;
  /** 0..100 untuk tampilan. */
  score: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
}

const WEIGHTS = {
  accord: 0.55,
  sweetness: 0.12,
  strength: 0.1,
  gender: 0.1,
  climate: 0.13,
} as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Tingkat manis parfum dari accord-nya. */
function perfumeSweetness(p: Perfume): number {
  return Math.max(p.accords.sweet ?? 0, p.accords.gourmand ?? 0, p.accords.vanilla ?? 0);
}

function genderMatch(profileGender: SurveyProfile["gender"], p: Perfume): number {
  if (profileGender === "any") return 1;
  if (p.gender === "uni") return 0.9;
  if (p.gender === profileGender) return 1;
  return 0.35; // mismatch: turunkan, tapi jangan buang total.
}

function buildReasons(p: Perfume, profile: SurveyProfile): string[] {
  const reasons: string[] = [];

  const shared = profile.topAccords
    .filter((a) => (p.accords[a] ?? 0) >= 0.4)
    .slice(0, 2)
    .map((a) => ACCORD_LABELS[a].toLowerCase());
  if (shared.length) {
    reasons.push(`Punya DNA ${shared.join(" & ")} yang kamu cari.`);
  }

  if (p.summerFriendly >= 0.8) {
    reasons.push("Ringan & aman buat cuaca panas Indonesia.");
  } else if (p.summerFriendly <= 0.4) {
    reasons.push("Paling nyala di malam hari atau ruangan ber-AC.");
  }

  if (p.dupeOf) {
    const inspo = findPerfume(p.dupeOf);
    if (inspo) reasons.push(`Alternatif terjangkau dari ${inspo.brand} ${inspo.name}.`);
  } else if (p.priceTier <= 2) {
    reasons.push("Harga ramah kantong dengan performa di atas kelasnya.");
  }

  return reasons;
}

function scoreOne(p: Perfume, profile: SurveyProfile): Recommendation {
  const breakdown: ScoreBreakdown = {
    accord: clamp01(cosine(profile.target, p.accords)),
    sweetness: 1 - Math.abs(profile.sweetness - perfumeSweetness(p)),
    strength: 1 - Math.abs(profile.strength - p.sillage),
    gender: genderMatch(profile.gender, p),
    climate: p.summerFriendly,
  };

  const total =
    breakdown.accord * WEIGHTS.accord +
    breakdown.sweetness * WEIGHTS.sweetness +
    breakdown.strength * WEIGHTS.strength +
    breakdown.gender * WEIGHTS.gender +
    breakdown.climate * WEIGHTS.climate;

  return {
    perfume: p,
    score: Math.round(total * 100),
    breakdown,
    reasons: buildReasons(p, profile),
  };
}

/** Hasilkan rekomendasi terurut. Hard filter: budget. */
export function recommend(profile: SurveyProfile, topN = 6): Recommendation[] {
  return PERFUMES.filter(
    (p) => p.priceTier <= profile.maxPriceTier && !profile.anchors.includes(p.id),
  )
    .map((p) => scoreOne(p, profile))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
