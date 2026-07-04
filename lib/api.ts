import type { SurveyProfile } from "./survey";
import type { Recommendation } from "./scoring";
import type { Explanation } from "./explain";

/** Bentuk respons POST /api/recommend. */
export interface RecommendResponse {
  profile: SurveyProfile;
  recommendations: Recommendation[];
  explanation: Explanation;
}
