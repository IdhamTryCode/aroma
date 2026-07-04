// ============================================================================
// Build seed dari dataset Parfumo (top populer) → lib/perfumes.generated.ts
//
// Cara pakai (sekali jalan, tidak dipakai saat runtime):
//   1. Download parfumo_data_clean.csv (TidyTuesday 2024-12-10) ke .aroma-data/
//   2. node scripts/build-seed.mjs
//
// Filter: hanya parfum paling banyak di-rating + punya accord & notes lengkap.
// Dedup vs 129 curated di lib/perfumes.ts. Harga ditebak dari brand; blurb
// digenerate; longevity/sillage/summerFriendly diestimasi dari accord (Parfumo
// tidak punya vote). Field asli & akurat: notes + accords.
// ============================================================================

import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const TARGET = 400; // jumlah parfum impor yang diinginkan (setelah dedup)

// --- Nama accord Parfumo → 20 accord kita (sisanya di-skip) ------------------
const ACCORD_MAP = {
  sweet: "sweet", honey: "sweet",
  fresh: "fresh", green: "fresh",
  floral: "floral", rose: "floral", violet: "floral",
  woody: "woody", coniferous: "woody", mossy: "mossy_chypre", earthy: "mossy_chypre",
  fruity: "fruity", tropical: "fruity",
  spicy: "spicy_warm", cinnamon: "spicy_warm",
  citrus: "citrus",
  oriental: "ambery", balsamic: "ambery", resinous: "ambery", ambery: "ambery",
  powdery: "powdery",
  gourmand: "gourmand", creamy: "gourmand", nutty: "gourmand", chocolate: "gourmand", coffee: "gourmand",
  vanilla: "vanilla",
  aquatic: "aquatic_ozonic", marine: "aquatic_ozonic", metallic: "aquatic_ozonic", mineral: "aquatic_ozonic",
  aromatic: "aromatic", herbal: "aromatic", terpenic: "aromatic",
  leathery: "leather", leather: "leather",
  smoky: "smoky", tobacco: "smoky",
  animal: "animalic", animalic: "animalic",
  musky: "musky", soapy: "musky",
};

const ACCORD_LABEL = {
  citrus: "citrus", fresh: "segar", aromatic: "aromatik", fruity: "buah", floral: "bunga",
  white_floral: "bunga putih", sweet: "manis", gourmand: "gourmand", vanilla: "vanila",
  spicy_warm: "rempah hangat", spicy_fresh: "rempah segar", woody: "kayu",
  mossy_chypre: "chypre", ambery: "amber", powdery: "powdery", musky: "musk",
  leather: "kulit", smoky: "smoky", animalic: "oud/animalic", aquatic_ozonic: "aquatic",
};

const NICHE = new Set(["Creed", "Maison Francis Kurkdjian", "Xerjoff", "Amouage", "Tom Ford", "Le Labo", "Byredo", "Initio", "Parfums de Marly", "Nishane", "Roja Parfums", "Frederic Malle", "Editions de Parfums Frederic Malle", "By Kilian", "Kilian", "Mancera", "Montale", "Escentric Molecules", "Juliette Has a Gun", "Diptyque", "Maison Margiela", "Serge Lutens", "Memo", "Nasomatto", "Clive Christian", "Ormonde Jayne", "Bond No. 9"]);
const ARAB = new Set(["Lattafa", "Armaf", "Rasasi", "Al Haramain", "Ard Al Zaafaran", "Swiss Arabian", "Afnan", "Maison Alhambra", "Ajmal"]);
const MID = new Set(["Versace", "Paco Rabanne", "Nautica", "Calvin Klein", "Azzaro", "Montblanc", "Dolce & Gabbana", "Jean Paul Gaultier", "Bvlgari", "Marc Jacobs", "Ariana Grande", "Hugo Boss", "Davidoff", "Mugler", "Thierry Mugler", "Carolina Herrera", "Zara"]);

const PRICE_IDR = { 1: "Rp150rb–350rb", 2: "Rp300rb–600rb", 3: "Rp900rb–1,5jt", 4: "Rp1,5jt–2,5jt", 5: "Rp3,5jt–6jt" };

function brandTier(brand) {
  if (ARAB.has(brand)) return brand.match(/lattafa|armaf|zaafaran|alhambra/i) ? 1 : 2;
  if (NICHE.has(brand)) return 5;
  if (MID.has(brand)) return 3;
  return 3; // default: designer menengah
}

const CONC = /\b(eau de parfum|eau de toilette|eau de cologne|extrait de parfum|eau fraiche|parfum|cologne|edt|edp|edc)\b/gi;
const norm = (s) => s.toLowerCase().replace(CONC, " ").replace(/[^a-z0-9]+/g, " ").trim();
const slug = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");

/** Bersihkan nama Parfumo. Format: "<Nama> <Brand> <Tahun> <Konsentrasi>" —
 *  jadi strip dari BELAKANG (konsentrasi → tahun → brand), diulang. */
function cleanName(rawName, brand) {
  let n = rawName.trim();
  const be = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let prev;
  do {
    prev = n;
    n = n.replace(/\s+(eau de parfum|eau de toilette|eau de cologne|extrait de parfum|eau fraiche|parfum|cologne|edt|edp|edc)\s*$/i, "");
    n = n.replace(/\s+(19|20)\d{2}\s*$/, "");
    n = n.replace(new RegExp(`\\s+${be}\\s*$`, "i"), "");
  } while (n !== prev);
  n = n.replace(new RegExp(`^${be}\\s+`, "i"), ""); // brand di depan (kita sudah tampilkan brand terpisah)
  return n.trim();
}

function inferGender(rawName) {
  if (/\b(homme|men|him|male|man|herren)\b/i.test(rawName)) return "masc";
  if (/\b(femme|women|woman|her|female|lady|donna|damen)\b/i.test(rawName)) return "fem";
  return "uni";
}

function parseAccords(str) {
  const vec = {};
  const weights = [1.0, 0.85, 0.7, 0.55, 0.45, 0.4, 0.35];
  str.split(",").map((s) => s.trim().toLowerCase()).forEach((name, i) => {
    const our = ACCORD_MAP[name];
    if (!our) return;
    vec[our] = Math.max(vec[our] ?? 0, weights[i] ?? 0.3);
  });
  return vec;
}

function parseNotes(str) {
  if (!str || str.trim() === "NA") return [];
  return [...new Set(str.split(",").map((s) => s.trim()).filter((s) => s && s !== "NA"))].slice(0, 8);
}

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const round2 = (n) => Number(n.toFixed(2));

function estimate(vec) {
  const g = (k) => vec[k] ?? 0;
  const fresh = g("fresh") + g("citrus") + g("aquatic_ozonic") + g("aromatic");
  const heavy = g("gourmand") + g("sweet") + g("ambery") + g("vanilla") + g("leather") + g("animalic") + g("smoky");
  return {
    summerFriendly: round2(clamp(0.5 + 0.35 * fresh - 0.28 * heavy, 0.2, 0.95)),
    longevity: round2(clamp(0.58 + 0.18 * heavy + 0.1 * (g("woody") + g("mossy_chypre")), 0.45, 0.9)),
    sillage: round2(clamp(0.55 + 0.2 * heavy, 0.4, 0.9)),
  };
}

// --- Main --------------------------------------------------------------------
const rows = parse(readFileSync(".aroma-data/parfumo.csv"), {
  columns: true,
  relax_quotes: true,
  skip_empty_lines: true,
  relax_column_count: true,
});

// Kunci dedup dari 129 curated di perfumes.ts.
const curatedText = readFileSync("lib/perfumes.ts", "utf8");
const seen = new Set();
for (const m of curatedText.matchAll(/name: "([^"]+)",\s*\n\s*brand: "([^"]+)"/g)) {
  seen.add(`${norm(m[2])}::${norm(cleanName(m[1], m[2]))}`);
}

const candidates = rows
  .map((r) => ({ ...r, votes: Number(r.Rating_Count) || 0 }))
  .filter((r) => r.votes > 0 && r.Main_Accords && r.Main_Accords.trim() && r.Name && r.Brand)
  .sort((a, b) => b.votes - a.votes);

const out = [];
// Seed dengan id curated supaya tabrakan id (near-dup) otomatis di-skip.
const usedIds = new Set([...curatedText.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]));
for (const r of candidates) {
  if (out.length >= TARGET) break;
  const brand = r.Brand.trim();
  const name = cleanName(r.Name, brand);
  // Gate kualitas: buang nama yang masih berantakan (sisa brand/tahun).
  if (!name || name.replace(/[^a-z0-9]/gi, "").length < 2 || name.length > 40) continue;
  if (/\b(19|20)\d{2}\b/.test(name)) continue;
  const nb = norm(brand);
  if (nb.length > 2 && norm(name).includes(nb)) continue;

  const key = `${norm(brand)}::${norm(name)}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const accords = parseAccords(r.Main_Accords);
  if (Object.keys(accords).length === 0) continue;

  const notes = {
    top: parseNotes(r.Top_Notes),
    heart: parseNotes(r.Middle_Notes),
    base: parseNotes(r.Base_Notes),
  };
  if (notes.top.length + notes.heart.length + notes.base.length === 0) continue;

  const id = `${slug(brand)}-${slug(name)}`.slice(0, 60);
  if (usedIds.has(id)) continue; // tabrakan → near-dup, skip
  usedIds.add(id);

  const tier = brandTier(brand);
  const topLabels = Object.entries(accords).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => ACCORD_LABEL[k]);
  const est = estimate(accords);

  out.push({
    id,
    name,
    brand,
    year: Number(r.Release_Year) || 0,
    gender: inferGender(r.Name),
    priceTier: tier,
    priceIDR: PRICE_IDR[tier],
    accords,
    notes,
    longevity: est.longevity,
    sillage: est.sillage,
    summerFriendly: est.summerFriendly,
    blurb: `Aroma dominan ${topLabels.join(", ")}.`,
  });
}

const header = `// AUTO-GENERATED oleh scripts/build-seed.mjs — JANGAN edit manual.
// Sumber: dataset Parfumo (TidyTuesday), difilter ke ${out.length} parfum paling populer.
// notes & accords = data asli; harga/blurb/longevity/sillage/summer = estimasi.
import type { Perfume } from "./perfumes";

export const IMPORTED_PERFUMES: Perfume[] = ${JSON.stringify(out, null, 2)};
`;
writeFileSync("lib/perfumes.generated.ts", header);

console.log(`✅ ${out.length} parfum → lib/perfumes.generated.ts`);
console.log("Contoh terpopuler:");
for (const p of out.slice(0, 5)) {
  console.log(`  ${p.brand} ${p.name} (${p.year}) · ${p.gender} · tier${p.priceTier} · [${Object.keys(p.accords).join(",")}]`);
}
