// ============================================================================
// Taksonomi Accord — 20 dimensi "DNA" aroma.
// Tiap parfum & tiap preferensi user direpresentasikan sebagai vektor di ruang
// 20 dimensi ini. Inilah bahasa bersama antara survey dan knowledge base.
// ============================================================================

export const ACCORDS = [
  "citrus", // jeruk, lemon, bergamot — cerah & segar
  "fresh", // hijau, dedaunan, herbal segar
  "aromatic", // lavender, sage, rosemary — "cukur/barbershop"
  "fruity", // apel, persik, beri (non-citrus)
  "floral", // mawar, melati, bunga umum
  "white_floral", // tuberose, gardenia, orange blossom — mekar & berat
  "sweet", // manis umum (gula, karamel ringan)
  "gourmand", // "bisa dimakan" — kopi, cokelat, karamel, kue
  "vanilla", // vanila spesifik
  "spicy_warm", // kayu manis, cengkeh, kapulaga — rempah hangat
  "spicy_fresh", // lada hitam/pink — rempah tajam segar
  "woody", // cedar, sandalwood, vetiver
  "mossy_chypre", // oakmoss, patchouli — klasik/elegan/earthy
  "ambery", // amber, labdanum, "oriental" hangat
  "powdery", // iris, bedak — lembut & elegan
  "musky", // musk, "aroma kulit bersih"
  "leather", // kulit, suede
  "smoky", // birch tar, dupa, incense
  "animalic", // oud, castoreum, civet — dalam & sensual
  "aquatic_ozonic", // laut, air, udara segar, "calone"
] as const;

export type Accord = (typeof ACCORDS)[number];

/** Vektor DNA: bobot 0..1 per accord. Accord yang tak disebut dianggap 0. */
export type AccordVector = Partial<Record<Accord, number>>;

/** Label bahasa Indonesia untuk UI. */
export const ACCORD_LABELS: Record<Accord, string> = {
  citrus: "Citrus",
  fresh: "Segar / Hijau",
  aromatic: "Aromatik (herbal)",
  fruity: "Buah",
  floral: "Bunga",
  white_floral: "Bunga Putih",
  sweet: "Manis",
  gourmand: "Gourmand (manis-makanan)",
  vanilla: "Vanila",
  spicy_warm: "Rempah Hangat",
  spicy_fresh: "Lada / Rempah Segar",
  woody: "Kayu",
  mossy_chypre: "Chypre / Lumut",
  ambery: "Amber",
  powdery: "Powdery / Bedak",
  musky: "Musk",
  leather: "Kulit",
  smoky: "Smoky / Dupa",
  animalic: "Animalic / Oud",
  aquatic_ozonic: "Aquatic / Ozonic",
};
