import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Logo({ size = 32, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image src="/aroma.png" alt="Aroma" width={size} height={size} priority={priority} />
  );
}

const VALUE_PROPS = [
  {
    icon: "🧬",
    title: "Dicocokkan by DNA",
    body: "Seleramu diterjemahkan jadi vektor 20 accord, lalu dicocokkan ke ratusan parfum. Bukan tebak-tebakan.",
  },
  {
    icon: "☀️",
    title: "Sadar cuaca tropis",
    body: "Paham panas-lembab Indonesia — wangi berat yang gampang 'nyekek' di siang bolong kami turunkan prioritasnya.",
  },
  {
    icon: "💸",
    title: "Dupe finder",
    body: "Suka parfum mahal? Kami carikan alternatif dengan DNA mirip yang jauh lebih ramah kantong.",
  },
  {
    icon: "🤖",
    title: "Alasan personal",
    body: "Tiap rekomendasi datang dengan penjelasan kenapa itu cocok buat kamu — bukan sekadar daftar nama.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Ceritakan seleramu",
    body: "Jawab 7 pertanyaan singkat soal vibe, suasana, dan wangi yang bikin kamu nyaman.",
  },
  {
    n: "02",
    title: "Kami baca DNA-nya",
    body: "Jawabanmu diterjemahkan jadi vektor 20 accord — sidik jari aroma yang kamu cari.",
  },
  {
    n: "03",
    title: "Dapat rekomendasi",
    body: "Parfum paling cocok untukmu, lengkap dengan alasan personal dan alternatif hemat.",
  },
];

const FAQ = [
  {
    q: "Gratis?",
    a: "Ya. Kuis dan rekomendasi sepenuhnya gratis, tanpa perlu daftar akun.",
  },
  {
    q: "Harus sudah punya parfum favorit?",
    a: "Nggak. Kalau punya, itu bikin hasil makin akurat — tapi kalau belum, tinggal lewati pertanyaannya.",
  },
  {
    q: "Seakurat apa rekomendasinya?",
    a: "Kami cocokkan berbasis DNA aroma + preferensimu, bukan iklan. Makin jujur jawabanmu, makin pas hasilnya.",
  },
  {
    q: "Datanya dari mana?",
    a: "Basis pengetahuan karakter tiap parfum (accord, notes, daya tahan). Masih tahap awal dan terus diperbanyak.",
  },
];

const SAMPLE_ACCORDS = ["Vanila", "Manis", "Rempah Hangat", "Amber", "Woody"];

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={26} priority />
            <span className="text-lg font-semibold tracking-tight">aroma</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/parfum"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
            >
              Katalog
            </Link>
            <Link
              href="/dupe"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
            >
              Cari dupe
            </Link>
            <Button
              render={<Link href="/quiz" />}
              nativeButton={false}
              className="rounded-full px-5"
            >
              Mulai kuis
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pb-24 pt-20 text-center sm:pt-28">
        <Logo size={76} priority />
        <span className="mt-8 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          Rekomendasi parfum personal
        </span>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Temukan parfum yang paling kamu banget.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Isi kuis dua menit. Aroma menerjemahkan seleramu jadi DNA aroma, lalu mencocokkannya
          ke ratusan parfum — lengkap dengan alasannya.
        </p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <Button
            render={<Link href="/quiz" />}
            nativeButton={false}
            className="rounded-full px-8 py-6 text-base"
          >
            Mulai kuis — gratis
          </Button>
          <span className="text-sm text-muted-foreground">2 menit · 7 pertanyaan · tanpa daftar</span>
          <Link href="/dupe" className="text-sm text-primary hover:underline">
            atau cari dupe parfum mahal →
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-secondary px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Kenapa Aroma?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Bukan katalog yang bikin kamu makin bingung. Ini asisten yang benar-benar memahami
            seleramu.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="rounded-[18px] border border-border bg-card p-6">
                <div className="text-2xl">{v.icon}</div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Cara kerjanya
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="text-sm font-medium tracking-tight text-primary">{s.n}</div>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dupe highlight (dark tile) */}
      <section className="bg-[#1d1d1f] px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium tracking-tight text-[#2997ff]">DUPE FINDER</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Wangi mewah, harga masuk akal.
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Pilih parfum mahal yang kamu incar — kami tunjukkan alternatif dengan DNA aroma paling
            mirip, tapi jauh lebih terjangkau.
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-[18px] border border-white/15 bg-white/5 p-5">
              <p className="text-xs text-white/50">Kamu suka</p>
              <p className="mt-1 font-semibold tracking-tight">Creed Aventus</p>
              <p className="text-sm text-white/50">Rp4jt–6jt</p>
            </div>
            <div className="text-center text-2xl text-white/40">→</div>
            <div className="flex-1 rounded-[18px] border border-[#2997ff]/40 bg-[#2997ff]/10 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">Alternatifnya</p>
                <span className="text-sm font-semibold text-[#2997ff]">100% mirip</span>
              </div>
              <p className="mt-1 font-semibold tracking-tight">Armaf Club de Nuit Intense Man</p>
              <p className="text-sm text-white/50">Rp300rb–500rb · hemat ~90%</p>
            </div>
          </div>

          <div className="mt-10">
            <Button
              render={<Link href="/dupe" />}
              nativeButton={false}
              className="rounded-full px-8"
            >
              Coba dupe finder
            </Button>
          </div>
        </div>
      </section>

      {/* Sample result preview */}
      <section className="bg-secondary px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Ini yang kamu dapat
          </h2>
          <p className="mt-3 text-center text-muted-foreground">Sekilas hasil untuk penyuka wangi manis-hangat.</p>

          <div className="mt-10 rounded-[18px] border border-border bg-card p-6">
            <p className="text-sm font-medium tracking-tight text-primary">DNA Aroma Kamu</p>
            <p className="mt-2 text-lg font-semibold leading-snug tracking-tight">
              DNA aromamu condong ke vanila, manis, dan rempah hangat — cozy dan bikin nagih.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SAMPLE_ACCORDS.map((a) => (
                <Badge
                  key={a}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs font-normal"
                >
                  {a}
                </Badge>
              ))}
            </div>

            <div className="mt-6 flex items-start justify-between gap-4 rounded-xl bg-secondary px-4 py-4">
              <div>
                <p className="text-xs text-muted-foreground">Lattafa</p>
                <p className="font-semibold tracking-tight">Khamrah EDP</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Kayu manis-kurma-vanila yang hangat & manis. Viral, murah, cocok cuaca sejuk.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold tracking-tight text-primary">93%</div>
                <div className="text-[11px] text-muted-foreground">cocok</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Pertanyaan umum
          </h2>
          <div className="mt-12 divide-y divide-border">
            {FAQ.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="font-semibold tracking-tight">{f.q}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-secondary px-6 py-24 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <Logo size={56} />
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Siap ketemu signature scent kamu?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Dua menit sekarang, hemat berjam-jam bingung di depan rak parfum.
          </p>
          <div className="mt-8">
            <Button
              render={<Link href="/quiz" />}
              nativeButton={false}
              className="rounded-full px-8 py-6 text-base"
            >
              Mulai kuis — gratis
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-semibold tracking-tight">aroma</span>
          </Link>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/quiz" className="hover:text-foreground">
              Mulai kuis
            </Link>
            <Link href="/parfum" className="hover:text-foreground">
              Katalog
            </Link>
            <Link href="/dupe" className="hover:text-foreground">
              Dupe finder
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">aroma.cfd · prototipe</p>
        </div>
      </footer>
    </main>
  );
}
