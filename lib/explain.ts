import { ACCORD_LABELS } from "./accords";
import type { Accord } from "./accords";
import type { Perfume } from "./perfumes";
import type { SurveyProfile } from "./survey";
import type { Recommendation } from "./scoring";

// ============================================================================
// Penjelasan personal. Pakai LLM (Kimi/Moonshot — endpoint OpenAI-compatible)
// bila AROMA_LLM_API_KEY tersedia; kalau tidak, fallback rule-based supaya app
// tetap jalan tanpa API key.
// Aturan emas: LLM HANYA menjelaskan kandidat yang sudah diambil DB — tidak
// pernah "mencari" atau mengarang parfum (mencegah halusinasi).
// ============================================================================

export interface Explanation {
  dnaSummary: string;
  picks: { id: string; why: string }[];
  source: "ai" | "rules";
}

function describeSweetness(v: number): string {
  if (v < 0.25) return "bersih dan nggak manis";
  if (v < 0.6) return "manis tipis-tipis";
  return "manis dan cozy";
}

function describeStrength(v: number): string {
  if (v < 0.35) return "lembut, nempel di badan";
  if (v < 0.7) return "medium dan sopan";
  return "kuat, kecium dari jauh";
}

function topPerfumeAccords(p: Perfume): string {
  return (Object.keys(p.accords) as Accord[])
    .filter((a) => (p.accords[a] ?? 0) >= 0.4)
    .sort((a, b) => (p.accords[b] ?? 0) - (p.accords[a] ?? 0))
    .slice(0, 4)
    .map((a) => ACCORD_LABELS[a].toLowerCase())
    .join(", ");
}

function ruleBased(profile: SurveyProfile, recs: Recommendation[]): Explanation {
  const accords = profile.topAccords.map((a) => ACCORD_LABELS[a].toLowerCase());
  const dnaSummary =
    accords.length > 0
      ? `DNA aromamu condong ke ${accords.join(", ")}. Kamu suka wangi yang ${describeSweetness(
          profile.sweetness,
        )} dengan karakter ${describeStrength(profile.strength)}.`
      : `Kamu suka wangi yang ${describeSweetness(profile.sweetness)} dengan karakter ${describeStrength(
          profile.strength,
        )}.`;

  return {
    dnaSummary,
    picks: recs.slice(0, 3).map((r) => ({
      id: r.perfume.id,
      why: r.reasons.join(" ") || "Cocok dengan profil aromamu secara keseluruhan.",
    })),
    source: "rules",
  };
}

function buildPrompt(profile: SurveyProfile, recs: Recommendation[]): string {
  const accords = profile.topAccords.map((a) => ACCORD_LABELS[a]).join(", ") || "(belum spesifik)";
  const candidates = recs
    .slice(0, 3)
    .map(
      (r) =>
        `- id:${r.perfume.id} | ${r.perfume.brand} ${r.perfume.name} | accord: ${topPerfumeAccords(
          r.perfume,
        )} | ${r.perfume.blurb}`,
    )
    .join("\n");

  return [
    "PROFIL USER:",
    `- DNA aroma dominan: ${accords}`,
    `- Level manis: ${describeSweetness(profile.sweetness)}`,
    `- Kekuatan diinginkan: ${describeStrength(profile.strength)}`,
    `- Preferensi gender: ${profile.gender}`,
    "",
    "KANDIDAT PARFUM (hanya gunakan ini, jangan mengarang yang lain):",
    candidates,
    "",
    "Tugas: tulis (1) dnaSummary — 2 kalimat hangat soal DNA aroma user, dan",
    "(2) untuk 3 kandidat teratas, alasan personal 1-2 kalimat kenapa cocok untuk dia.",
    'Balas HANYA JSON valid tanpa markdown: {"dnaSummary": string, "picks": [{"id": string, "why": string}]}',
  ].join("\n");
}

function parseJson(text: string): { dnaSummary: string; picks: { id: string; why: string }[] } | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    if (typeof parsed.dnaSummary === "string" && Array.isArray(parsed.picks)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export async function explain(
  profile: SurveyProfile,
  recs: Recommendation[],
): Promise<Explanation> {
  const apiKey = process.env.AROMA_LLM_API_KEY;
  if (!apiKey) return ruleBased(profile, recs);

  const baseUrl = process.env.AROMA_LLM_BASE_URL ?? "https://api.moonshot.ai/v1";
  // Default model cepat (non-reasoning) — tugas ini menulis prosa singkat, bukan menalar.
  // Model reasoning (kimi-k2.5 ~34s, kimi-k2.6 >60s) bisa dipakai via env tapi lambat.
  const model = process.env.AROMA_LLM_MODEL ?? "moonshot-v1-8k";

  try {
    const controller = new AbortController();
    // Beri margin agar model reasoning yang lambat pun tetap muat. Timeout → fallback.
    const timeout = setTimeout(() => controller.abort(), 45000);
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        // Ruang lega: model reasoning memakai token untuk "mikir"; non-reasoning cukup santai.
        max_tokens: 3000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Kamu konsultan parfum untuk Aroma. Bahasa Indonesia santai, hangat, ringkas. " +
              "Hanya rekomendasikan parfum dari daftar kandidat yang diberikan.",
          },
          { role: "user", content: buildPrompt(profile, recs) },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return ruleBased(profile, recs);
    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    const parsed = parseJson(text);
    if (!parsed) return ruleBased(profile, recs);

    // Jaga integritas: buang pick yang id-nya tidak ada di kandidat (anti-halusinasi).
    const validIds = new Set(recs.map((r) => r.perfume.id));
    const picks = parsed.picks.filter((p) => validIds.has(p.id));
    if (picks.length === 0) return ruleBased(profile, recs);

    return { dnaSummary: parsed.dnaSummary, picks, source: "ai" };
  } catch {
    return ruleBased(profile, recs);
  }
}
