import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { RecommendResponse } from "./api";

// ============================================================================
// Penyimpanan hasil survey by UUID.
// Prod: Upstash Redis (bila UPSTASH_REDIS_REST_URL/TOKEN diisi) — jalan di
// Vercel/serverless. Dev: fallback file lokal supaya nggak perlu Upstash.
// ============================================================================

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TTL_SECONDS = 60 * 60 * 24 * 90; // hasil disimpan 90 hari

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const DIR = path.join(process.cwd(), ".aroma-data", "results");
const key = (id: string) => `aroma:result:${id}`;

export async function saveResult(id: string, data: RecommendResponse): Promise<void> {
  if (redis) {
    await redis.set(key(id), data, { ex: TTL_SECONDS });
    return;
  }
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, `${id}.json`), JSON.stringify(data), "utf8");
}

export async function loadResult(id: string): Promise<RecommendResponse | null> {
  if (!UUID_RE.test(id)) return null; // cegah key/path aneh (traversal)
  if (redis) {
    return (await redis.get<RecommendResponse>(key(id))) ?? null;
  }
  try {
    const raw = await fs.readFile(path.join(DIR, `${id}.json`), "utf8");
    return JSON.parse(raw) as RecommendResponse;
  } catch {
    return null;
  }
}
