import type { Accord, AccordVector } from "./accords";
import { findPerfume, type Gender } from "./perfumes";

// ============================================================================
// JANTUNG PRODUK: survey + pemetaan jawaban → bobot accord.
// Tiap opsi membawa kontribusi accord-nya sendiri, jadi kuis dan model DNA
// bicara bahasa yang sama. buildProfile() merangkum semua jawaban jadi satu
// "target DNA" + filter (gender, budget) + preferensi (manis, kekuatan).
// ============================================================================

export type QuestionType = "single" | "multi" | "scale" | "anchor";

export interface SurveyOption {
  id: string;
  label: string;
  emoji?: string;
  /** Kontribusi accord bila opsi ini dipilih. */
  accords?: AccordVector;
}

export interface SurveyQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: SurveyOption[];
  /** Untuk type "scale" (0..4). */
  scale?: { minLabel: string; maxLabel: string };
}

/** Jawaban: option id (single) | option ids (multi) | angka 0..4 (scale). */
export type Answer = string | string[] | number;
export type SurveyAnswers = Record<string, Answer>;

export interface SurveyProfile {
  /** Vektor DNA yang dicari user. */
  target: AccordVector;
  /** 0..1 — seberapa suka manis. */
  sweetness: number;
  /** 0..1 — target proyeksi/sillage (soft → beast mode). */
  strength: number;
  gender: Gender | "any";
  maxPriceTier: 1 | 2 | 3 | 4 | 5;
  /** Parfum yang sudah disukai user (opsional; sinyal terkuat; dikecualikan dari hasil). */
  anchors: string[];
  /** Accord dominan (untuk penjelasan). */
  topAccords: Accord[];
}

/** Id pertanyaan — dipakai buildProfile untuk menafsirkan jawaban khusus. */
export const QID = {
  anchor: "anchor",
  vibe: "vibe",
  occasion: "occasion",
  notes: "notes",
  sweet: "sweet",
  strength: "strength",
  gender: "gender",
  budget: "budget",
} as const;

export const SURVEY: SurveyQuestion[] = [
  {
    id: QID.anchor,
    title: "Ada parfum yang sudah kamu suka?",
    subtitle:
      "Ini sinyal paling akurat buat kami. Belum punya atau nggak yakin? Nggak apa-apa — langsung lewati aja.",
    type: "anchor",
  },
  {
    id: QID.vibe,
    title: "Kalau kamu jadi wangi, kamu pengen orang mikir apa?",
    subtitle: "Pilih kesan yang paling kamu banget.",
    type: "single",
    options: [
      { id: "clean", label: "Bersih & rapi", emoji: "🫧", accords: { fresh: 0.8, citrus: 0.6, musky: 0.6, aquatic_ozonic: 0.5, aromatic: 0.4 } },
      { id: "seductive", label: "Seductive & bikin nagih", emoji: "🔥", accords: { ambery: 0.8, vanilla: 0.6, woody: 0.6, spicy_warm: 0.6, animalic: 0.4, leather: 0.4 } },
      { id: "playful", label: "Ceria & playful", emoji: "🍭", accords: { fruity: 0.8, sweet: 0.6, citrus: 0.5, white_floral: 0.4 } },
      { id: "luxe", label: "Mewah & berkelas", emoji: "🥂", accords: { woody: 0.7, mossy_chypre: 0.6, ambery: 0.5, leather: 0.5, powdery: 0.4, floral: 0.4 } },
      { id: "cozy", label: "Hangat & cozy", emoji: "🧸", accords: { gourmand: 0.7, vanilla: 0.7, sweet: 0.6, spicy_warm: 0.5 } },
    ],
  },
  {
    id: QID.occasion,
    title: "Mau dipakai buat apa aja?",
    subtitle: "Boleh pilih lebih dari satu.",
    type: "multi",
    options: [
      { id: "work", label: "Kerja / kuliah", emoji: "💼", accords: { fresh: 0.5, citrus: 0.4, aromatic: 0.4, musky: 0.4 } },
      { id: "date", label: "Kencan / malam", emoji: "🌙", accords: { ambery: 0.6, vanilla: 0.5, woody: 0.4, spicy_warm: 0.4, sweet: 0.4 } },
      { id: "daily", label: "Harian santai", emoji: "☀️", accords: { citrus: 0.5, fresh: 0.5, fruity: 0.4, musky: 0.3 } },
      { id: "formal", label: "Acara formal", emoji: "🎩", accords: { woody: 0.6, mossy_chypre: 0.5, leather: 0.4, powdery: 0.3, aromatic: 0.3 } },
      { id: "sport", label: "Olahraga / gerah", emoji: "🏃", accords: { citrus: 0.6, aquatic_ozonic: 0.6, fresh: 0.5 } },
    ],
  },
  {
    id: QID.notes,
    title: "Wangi sehari-hari yang bikin kamu nyaman?",
    subtitle: "Pilih yang bikin kamu 'ah, enak'. Boleh banyak.",
    type: "multi",
    options: [
      { id: "coffee", label: "Kopi", emoji: "☕", accords: { gourmand: 0.7, sweet: 0.4 } },
      { id: "laundry", label: "Laundry baru", emoji: "🧺", accords: { musky: 0.7, aquatic_ozonic: 0.5, powdery: 0.4, fresh: 0.4 } },
      { id: "rain", label: "Tanah basah / hujan", emoji: "🌧️", accords: { aquatic_ozonic: 0.7, mossy_chypre: 0.4, fresh: 0.4 } },
      { id: "wood", label: "Kayu", emoji: "🪵", accords: { woody: 0.8 } },
      { id: "flower", label: "Bunga", emoji: "🌸", accords: { floral: 0.7, white_floral: 0.5 } },
      { id: "fruit", label: "Buah", emoji: "🍑", accords: { fruity: 0.8, sweet: 0.4 } },
      { id: "vanilla", label: "Vanila", emoji: "🍦", accords: { vanilla: 0.8, gourmand: 0.5, sweet: 0.5 } },
      { id: "spice", label: "Rempah", emoji: "🌶️", accords: { spicy_warm: 0.7, spicy_fresh: 0.3 } },
      { id: "sea", label: "Laut", emoji: "🌊", accords: { aquatic_ozonic: 0.7, citrus: 0.4, fresh: 0.4 } },
    ],
  },
  {
    id: QID.sweet,
    title: "Suka wangi yang manis?",
    subtitle: "Geser sesuai seleramu.",
    type: "scale",
    scale: { minLabel: "Nggak manis", maxLabel: "Manis banget" },
  },
  {
    id: QID.strength,
    title: "Seberapa 'kuat' wanginya?",
    subtitle: "Nempel di badan aja, atau kecium dari jauh?",
    type: "scale",
    scale: { minLabel: "Soft & intim", maxLabel: "Beast mode" },
  },
  {
    id: QID.gender,
    title: "Kamu pengen wangi yang...",
    type: "single",
    options: [
      { id: "masc", label: "Maskulin", emoji: "🧔" },
      { id: "fem", label: "Feminin", emoji: "💃" },
      { id: "any", label: "Uniseks / bebas", emoji: "⚧" },
    ],
  },
  {
    id: QID.budget,
    title: "Budget parfum kamu?",
    subtitle: "Kami tetap tunjukkan opsi lebih murah yang cocok.",
    type: "single",
    options: [
      { id: "b1", label: "< Rp500rb", emoji: "💸" },
      { id: "b2", label: "Rp500rb – 1,5jt", emoji: "💵" },
      { id: "b3", label: "Rp1,5jt – 3jt", emoji: "💳" },
      { id: "b4", label: "Bebas / niche", emoji: "💎" },
    ],
  },
];

const BUDGET_TO_TIER: Record<string, 1 | 2 | 3 | 4 | 5> = {
  b1: 2,
  b2: 3,
  b3: 4,
  b4: 5,
};

function addAccords(target: AccordVector, delta?: AccordVector, weight = 1) {
  if (!delta) return;
  for (const key of Object.keys(delta) as Accord[]) {
    target[key] = (target[key] ?? 0) + (delta[key] ?? 0) * weight;
  }
}

function optionById(q: SurveyQuestion, id: string): SurveyOption | undefined {
  return q.options?.find((o) => o.id === id);
}

/** Terjemahkan jawaban survey → target DNA + filter + preferensi. */
export function buildProfile(answers: SurveyAnswers): SurveyProfile {
  const target: AccordVector = {};
  const anchors: string[] = [];
  let sweetness = 0.5;
  let strength = 0.5;
  let gender: Gender | "any" = "any";
  let maxPriceTier: 1 | 2 | 3 | 4 | 5 = 5;

  for (const q of SURVEY) {
    const answer = answers[q.id];
    if (answer === undefined) continue;

    if (q.id === QID.anchor) {
      // Parfum yang sudah disukai = sinyal terkuat; bobotkan lebih tinggi. Opsional.
      for (const id of (answer as string[]) ?? []) {
        const p = findPerfume(id);
        if (!p) continue;
        anchors.push(id);
        addAccords(target, p.accords, 1.5);
      }
      continue;
    }

    if (q.id === QID.sweet) {
      const v = Number(answer) / 4; // 0..1
      sweetness = v;
      if (v === 0) {
        // Benci manis → dorong menjauh dari accord manis.
        addAccords(target, { sweet: -0.5, gourmand: -0.5, vanilla: -0.3 });
      } else {
        addAccords(target, { sweet: v * 0.8, gourmand: v * 0.7, vanilla: v * 0.5 });
      }
      continue;
    }

    if (q.id === QID.strength) {
      strength = Number(answer) / 4;
      continue;
    }

    if (q.id === QID.gender) {
      gender = (answer as Gender | "any") ?? "any";
      continue;
    }

    if (q.id === QID.budget) {
      maxPriceTier = BUDGET_TO_TIER[answer as string] ?? 5;
      continue;
    }

    // Pertanyaan berbasis accord (vibe / occasion / notes).
    if (q.type === "single") {
      addAccords(target, optionById(q, answer as string)?.accords);
    } else if (q.type === "multi") {
      for (const id of answer as string[]) {
        addAccords(target, optionById(q, id)?.accords);
      }
    }
  }

  const topAccords = (Object.keys(target) as Accord[])
    .filter((k) => (target[k] ?? 0) > 0)
    .sort((a, b) => (target[b] ?? 0) - (target[a] ?? 0))
    .slice(0, 5);

  return { target, sweetness, strength, gender, maxPriceTier, anchors, topAccords };
}
