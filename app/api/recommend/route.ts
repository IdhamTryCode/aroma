import { randomUUID } from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { buildProfile, type SurveyAnswers } from "@/lib/survey";
import { recommend } from "@/lib/scoring";
import { explain } from "@/lib/explain";
import { saveResult } from "@/lib/store";

// Rate limit per-IP (lindungi biaya LLM dari spam). Aktif bila env Upstash ada.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "60 s"),
        prefix: "aroma:rl",
      })
    : null;

export async function POST(req: Request) {
  if (ratelimit) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return Response.json(
        { error: "Terlalu banyak permintaan. Coba lagi sebentar ya." },
        { status: 429 },
      );
    }
  }

  const body = (await req.json()) as { answers?: SurveyAnswers };
  if (!body?.answers) {
    return Response.json({ error: "answers wajib diisi" }, { status: 400 });
  }

  const profile = buildProfile(body.answers);
  const recommendations = recommend(profile);
  const explanation = await explain(profile, recommendations);

  const id = randomUUID();
  await saveResult(id, { profile, recommendations, explanation });

  return Response.json({ id });
}
