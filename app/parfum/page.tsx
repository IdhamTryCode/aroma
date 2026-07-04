import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Katalog Parfum — jelajah & filter DNA aroma | Aroma",
  description:
    "Jelajahi ratusan parfum: cari nama/brand, filter gender, budget, dan accord. Klik untuk lihat DNA aroma, notes, dan alternatif hematnya.",
};

export default function CatalogPage() {
  return <Catalog />;
}
