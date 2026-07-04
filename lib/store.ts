import { promises as fs } from "fs";
import path from "path";
import type { RecommendResponse } from "./api";

// ============================================================================
// Penyimpanan hasil survey by UUID. Sekarang berbasis file (dev-friendly,
// gitignored). Untuk produksi/skala, ganti implementasi ini ke DB (Supabase)
// tanpa mengubah pemanggilnya.
// ============================================================================

const DIR = path.join(process.cwd(), ".aroma-data", "results");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function saveResult(id: string, data: RecommendResponse): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, `${id}.json`), JSON.stringify(data), "utf8");
}

export async function loadResult(id: string): Promise<RecommendResponse | null> {
  if (!UUID_RE.test(id)) return null; // cegah path traversal + id ngasal
  try {
    const raw = await fs.readFile(path.join(DIR, `${id}.json`), "utf8");
    return JSON.parse(raw) as RecommendResponse;
  } catch {
    return null;
  }
}
