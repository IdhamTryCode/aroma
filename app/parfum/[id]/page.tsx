import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Accord } from "@/lib/accords";
import { ACCORD_LABELS } from "@/lib/accords";
import type { Perfume } from "@/lib/perfumes";
import { PERFUMES, findPerfume } from "@/lib/perfumes";
import { similarPerfumes, findDupes } from "@/lib/similarity";
import { BackButton } from "@/components/back-button";
import { Badge } from "@/components/ui/badge";

// SSG: pra-render semua halaman parfum saat build → cepat & bagus untuk SEO.
export function generateStaticParams() {
  return PERFUMES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = findPerfume(id);
  if (!p) return { title: "Parfum tidak ditemukan | Aroma" };
  return {
    title: `${p.brand} ${p.name} — DNA aroma, notes & alternatif | Aroma`,
    description: p.blurb,
  };
}

const GENDER_LABEL: Record<Perfume["gender"], string> = {
  masc: "Maskulin",
  fem: "Feminin",
  uni: "Uniseks",
};

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1">
      <div className="mb-1 text-[11px] text-muted-foreground">{label}</div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-foreground/70" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

function NoteRow({ label, notes }: { label: string; notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center">
      <div className="w-24 shrink-0 text-sm text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {notes.map((n) => (
          <Badge key={n} variant="outline" className="rounded-full text-[11px] font-normal">
            {n}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function PerfumeLink({ p, note }: { p: Perfume; note?: string }) {
  return (
    <Link
      href={`/parfum/${p.id}`}
      className="flex items-center justify-between rounded-[18px] border border-border bg-card p-4 transition hover:border-foreground/30"
    >
      <div>
        <p className="text-xs text-muted-foreground">{p.brand}</p>
        <p className="font-medium tracking-tight">{p.name}</p>
        {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
      </div>
      <span className="text-sm text-muted-foreground">{p.priceIDR}</span>
    </Link>
  );
}

export default async function PerfumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = findPerfume(id);
  if (!p) notFound();

  const accords = (Object.keys(p.accords) as Accord[]).sort(
    (a, b) => (p.accords[b] ?? 0) - (p.accords[a] ?? 0),
  );
  const similar = similarPerfumes(p, 4);
  const dupes = p.priceTier >= 3 ? findDupes(p, 3) : [];
  const inspo = p.dupeOf ? findPerfume(p.dupeOf) : undefined;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <BackButton />

      {/* Header */}
      <div className="mt-6">
        <p className="text-sm text-muted-foreground">{p.brand}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{p.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {p.year} · {GENDER_LABEL[p.gender]} · {p.priceIDR}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {accords.slice(0, 5).map((a) => (
          <Badge key={a} variant="secondary" className="rounded-full px-3 py-1 text-xs font-normal">
            {ACCORD_LABELS[a]}
          </Badge>
        ))}
      </div>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{p.blurb}</p>

      {inspo && (
        <p className="mt-4 text-sm">
          Alternatif terjangkau dari{" "}
          <Link href={`/parfum/${inspo.id}`} className="text-primary hover:underline">
            {inspo.brand} {inspo.name}
          </Link>
          .
        </p>
      )}

      {/* Notes pyramid */}
      <section className="mt-12">
        <h2 className="text-sm font-medium tracking-tight text-primary">Piramida Notes</h2>
        <div className="mt-3">
          <NoteRow label="Atas" notes={p.notes.top} />
          <NoteRow label="Tengah" notes={p.notes.heart} />
          <NoteRow label="Dasar" notes={p.notes.base} />
        </div>
      </section>

      {/* DNA bars */}
      <section className="mt-12">
        <h2 className="text-sm font-medium tracking-tight text-primary">DNA Aroma</h2>
        <div className="mt-4 space-y-3">
          {accords.map((a) => (
            <div key={a} className="flex items-center gap-3">
              <div className="w-32 shrink-0 text-sm">{ACCORD_LABELS[a]}</div>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(p.accords[a] ?? 0) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-end gap-4">
          <Meter label="Tahan lama" value={p.longevity} />
          <Meter label="Proyeksi" value={p.sillage} />
          <Meter label="Cocok cuaca panas" value={p.summerFriendly} />
        </div>
      </section>

      {/* Dupes (kalau mahal) */}
      {dupes.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-medium tracking-tight text-primary">Alternatif lebih hemat</h2>
          <div className="mt-4 space-y-3">
            {dupes.map((m) => (
              <PerfumeLink
                key={m.perfume.id}
                p={m.perfume}
                note={`${Math.round(m.similarity * 100)}% mirip DNA`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mirip dengan ini */}
      <section className="mt-12">
        <h2 className="text-sm font-medium tracking-tight text-primary">Mirip dengan ini</h2>
        <div className="mt-4 space-y-3">
          {similar.map((m) => (
            <PerfumeLink
              key={m.perfume.id}
              p={m.perfume}
              note={`${Math.round(m.similarity * 100)}% mirip DNA`}
            />
          ))}
        </div>
      </section>

      <div className="mt-14 flex justify-center">
        <Link
          href="/quiz"
          className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground"
        >
          Cari parfum yang cocok untukku
        </Link>
      </div>
    </div>
  );
}
