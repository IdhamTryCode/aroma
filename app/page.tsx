import Link from "next/link";
import Image from "next/image";
import { SiteLogo } from "@/components/site-logo";
import { SiteFooter } from "@/components/site-footer";

const CTA =
  "inline-flex items-center justify-center rounded-full bg-aura px-8 py-3.5 text-base font-semibold text-white shadow-glow transition hover:scale-[1.02] active:scale-95";

const STATS = [
  { value: "500+", label: "parfum populer" },
  { value: "AI", label: "analisis personal" },
  { value: "2 mnt", label: "langsung dapat" },
];

const VALUE_PROPS = [
  { icon: "🧬", title: "Dicocokkan by DNA", body: "Seleramu jadi vektor 20 accord, lalu dicocokkan ke ratusan parfum. Bukan tebak-tebakan." },
  { icon: "🌴", title: "Sadar cuaca tropis", body: "Paham panas-lembab Indonesia — wangi berat yang gampang 'nyekek' kami turunkan prioritasnya." },
  { icon: "💸", title: "Dupe finder", body: "Suka parfum mahal? Kami carikan alternatif DNA mirip yang jauh lebih ramah kantong." },
  { icon: "🤖", title: "Alasan personal", body: "Tiap rekomendasi ada penjelasan kenapa cocok buat kamu — bukan sekadar daftar nama." },
];

const STEPS = [
  { n: "01", title: "Ceritakan seleramu", body: "Jawab 7 pertanyaan singkat soal vibe, suasana, dan wangi yang bikin kamu nyaman." },
  { n: "02", title: "Kami baca DNA-nya", body: "Jawabanmu diterjemahkan jadi vektor 20 accord — sidik jari aroma yang kamu cari." },
  { n: "03", title: "Dapat rekomendasi", body: "Parfum paling cocok untukmu, lengkap dengan alasan personal dan alternatif hemat." },
];

const FAQ = [
  { q: "Gratis?", a: "Ya. Kuis dan rekomendasi sepenuhnya gratis, tanpa perlu daftar akun." },
  { q: "Harus sudah punya parfum favorit?", a: "Nggak. Kalau punya, hasil makin akurat — kalau belum, tinggal lewati pertanyaannya." },
  { q: "Seakurat apa?", a: "Kami cocokkan berbasis DNA aroma + preferensimu, dianalisis AI — bukan iklan. Makin jujur jawabanmu, makin pas." },
  { q: "Berapa banyak parfumnya?", a: "Lebih dari 500 parfum populer — dari designer, niche, sampai alternatif terjangkau — dan terus bertambah." },
];

const SAMPLE_ACCORDS = ["Vanila", "Manis", "Rempah Hangat", "Amber", "Woody"];

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <SiteLogo />
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link href="/parfum" className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:block">
              Katalog
            </Link>
            <Link href="/dupe" className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground sm:block">
              Cari dupe
            </Link>
            <Link href="/quiz" className="rounded-full bg-aura px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-105 active:scale-95">
              Mulai
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pb-20 pt-16 text-center sm:pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <Image src="/aroma.png" alt="Aroma" width={88} height={88} priority className="animate-float" />
          <span className="mt-6 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
            Rekomendasi parfum personal, ditenagai AI
          </span>
          <h1 className="mt-6 text-[2.7rem] font-semibold leading-[1.03] tracking-tight sm:text-6xl md:text-[4.6rem]">
            Temukan parfum yang <span className="italic text-aura">paling kamu banget.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Isi kuis dua menit. Aroma menerjemahkan seleramu jadi DNA aroma, lalu mencocokkannya ke
            ratusan parfum — lengkap dengan alasannya.
          </p>
          <Link href="/quiz" className={`mt-9 ${CTA}`}>
            Mulai kuis, gratis
          </Link>

          {/* Stats */}
          <div className="mt-12 grid w-full max-w-md grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card">
            {STATS.map((s) => (
              <div key={s.label} className="px-4 py-5">
                <div className="font-serif text-2xl font-semibold sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-secondary/50 px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Kenapa Aroma?</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Bukan katalog yang bikin makin bingung. Ini asisten yang benar-benar memahami seleramu.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-3xl">{v.icon}</div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Cara kerjanya</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="font-serif text-3xl font-semibold text-aura">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dupe highlight */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-[#241d15] p-8 text-white shadow-soft sm:p-12">
          <p className="text-sm font-semibold tracking-wide text-[#d8b892]">DUPE FINDER</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Wangi mewah, harga masuk akal.
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Pilih parfum mahal yang kamu incar — kami tunjukkan alternatif dengan DNA aroma paling
            mirip, tapi jauh lebih terjangkau.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-white/50">Kamu suka</p>
              <p className="mt-1 font-semibold tracking-tight">Creed Aventus</p>
              <p className="text-sm text-white/50">Rp4jt–6jt</p>
            </div>
            <div className="text-center text-2xl text-white/40">→</div>
            <div className="flex-1 rounded-2xl border border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">Alternatifnya</p>
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">100% mirip</span>
              </div>
              <p className="mt-1 font-semibold tracking-tight">Armaf Club de Nuit Intense</p>
              <p className="text-sm text-white/50">Rp300rb–500rb · hemat ~90%</p>
            </div>
          </div>
          <Link href="/dupe" className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-base font-semibold text-[#241d15] transition hover:scale-105 active:scale-95">
            Coba dupe finder
          </Link>
        </div>
      </section>

      {/* Sample preview */}
      <section className="bg-secondary/50 px-5 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Ini yang kamu dapat</h2>
          <p className="mt-3 text-center text-muted-foreground">Sekilas hasil untuk penyuka wangi manis-hangat.</p>
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm font-semibold tracking-wide text-aura">DNA Aroma Kamu</p>
            <p className="mt-2 font-serif text-2xl font-semibold leading-snug tracking-tight">
              DNA aromamu condong ke vanila, manis, dan rempah hangat — cozy dan bikin nagih.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SAMPLE_ACCORDS.map((a) => (
                <span key={a} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl bg-secondary p-4">
              <div>
                <p className="text-xs text-muted-foreground">Lattafa</p>
                <p className="font-semibold tracking-tight">Khamrah EDP</p>
                <p className="mt-1 text-sm text-muted-foreground">Kayu manis-kurma-vanila yang hangat & manis.</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-aura">93%</div>
                <div className="text-[11px] text-muted-foreground">cocok</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Pertanyaan umum</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <h3 className="font-semibold tracking-tight">{f.q}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-24 pt-4 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <Image src="/aroma.png" alt="Aroma" width={60} height={60} />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Siap ketemu <span className="italic text-aura">signature scent</span> kamu?
          </h2>
          <p className="mt-3 text-muted-foreground">Dua menit sekarang, hemat berjam-jam bingung di depan rak parfum.</p>
          <Link href="/quiz" className={`mt-8 ${CTA}`}>
            Mulai kuis, gratis
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
