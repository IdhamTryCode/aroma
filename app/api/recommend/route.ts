import { randomUUID } from "crypto";
import { buildProfile, type SurveyAnswers } from "@/lib/survey";
import { recommend } from "@/lib/scoring";
import { explain } from "@/lib/explain";
import { saveResult } from "@/lib/store";

export async function POST(req: Request) {
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
