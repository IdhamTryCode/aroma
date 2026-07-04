import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadResult } from "@/lib/store";
import { Results } from "@/components/results";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await loadResult(id);
  const title = "DNA Aroma Kamu | Aroma";
  const description =
    data?.explanation.dnaSummary ?? "Temukan parfum yang paling kamu banget di Aroma.";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HasilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadResult(id);
  if (!data) notFound();
  return <Results data={data} />;
}
