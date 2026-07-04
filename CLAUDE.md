@AGENTS.md

# Aroma

Rekomendasi parfum personal: user isi survey singkat → jawaban dipetakan ke "DNA aroma"
(vektor 20 accord) → dicocokkan ke knowledge base parfum via cosine similarity + rerank
iklim tropis → AI (Claude) menjelaskan kenapa cocok. Domain: pasar Indonesia (sadar cuaca
panas-lembab, budaya dupe/decant).

## Arsitektur (di mana "otak"-nya)

- `lib/accords.ts` — taksonomi 20 accord (dimensi vektor DNA). Bahasa bersama survey ↔ data.
- `lib/perfumes.ts` — knowledge base (seed). Tiap parfum = vektor accord + notes + atribut.
- `lib/survey.ts` — pertanyaan survey + pemetaan jawaban → bobot accord. **Jantung produk.**
- `lib/scoring.ts` — bangun target vector, cosine similarity, hard filter, rerank tropis.
- `lib/explain.ts` — penjelasan via LLM (Kimi/Moonshot, OpenAI-compatible); fallback rule-based bila tak ada API key.
- `app/api/recommend/route.ts` — endpoint POST: answers → rekomendasi + penjelasan.
- `app/` — UI (Next.js App Router, shadcn/ui).

## Env (`.env.local`)

- `AROMA_LLM_API_KEY` — kunci LLM. Tanpa ini, penjelasan pakai fallback rule-based.
- `AROMA_LLM_BASE_URL` — default `https://api.moonshot.ai/v1` (OpenAI-compatible).
- `AROMA_LLM_MODEL` — default `moonshot-v1-8k` (cepat ~5s). Alternatif Kimi: `kimi-k2.5` (~34s, reasoning). `kimi-k2.6` >60s (terlalu lambat untuk request sinkron).

Aturan emas rekomendasi: **fakta dari DB, penalaran dari LLM.** LLM tidak pernah "mencari"
parfum sendiri (mencegah halusinasi) — ia hanya menjelaskan kandidat yang sudah diambil DB.

## UI

Pakai `DESIGN.md` (design system Apple) untuk semua kerja UI: whitespace lega, tipografi
bersih, restraint. Komponen dari shadcn/ui + Tailwind.

## Design guidelines (Karpathy)

Bias ke kehati-hatian. Untuk tugas trivial, pakai judgment.

### 1. Think Before Coding
Jangan berasumsi. Jangan sembunyikan kebingungan. Munculkan tradeoff.
- Nyatakan asumsi eksplisit; kalau ragu, tanya.
- Kalau ada beberapa interpretasi, sajikan — jangan pilih diam-diam.
- Kalau ada pendekatan lebih sederhana, katakan. Push back bila perlu.
- Kalau ada yang tidak jelas, berhenti. Sebutkan yang membingungkan. Tanya.

### 2. Simplicity First
Kode minimum yang menyelesaikan masalah. Tidak ada yang spekulatif.
- Tidak ada fitur di luar yang diminta.
- Tidak ada abstraksi untuk kode sekali pakai.
- Tidak ada "fleksibilitas" yang tidak diminta.
- Tidak ada error handling untuk skenario mustahil.
- Kalau 200 baris bisa jadi 50, tulis ulang.
- Tes: "Apakah senior engineer bilang ini overcomplicated?" Kalau ya, sederhanakan.

### 3. Surgical Changes
Sentuh hanya yang perlu. Bereskan hanya kekacauanmu sendiri.
- Jangan "memperbaiki" kode/komentar/format di sekitarnya.
- Jangan refactor yang tidak rusak.
- Ikuti gaya yang ada, meski kamu akan melakukannya berbeda.
- Kalau lihat dead code tak terkait, sebutkan — jangan hapus.
- Tes: setiap baris yang berubah bisa dilacak langsung ke permintaan user.

### 4. Goal-Driven Execution
Definisikan kriteria sukses. Loop sampai terverifikasi.
- Ubah tugas jadi tujuan yang bisa diverifikasi.
- Untuk tugas multi-langkah, nyatakan rencana singkat + cara verifikasi tiap langkah.
