export type CareerStage = "emerging" | "mid-career" | "established";

export type CreativeField =
  | "visual-arts"
  | "fashion"
  | "music"
  | "film"
  | "theatre"
  | "literature"
  | "other";

export type FrequencyAnswer = "none" | "few" | "several" | "many";

export type YesNoUnsure = "yes" | "no" | "unsure";

export interface ArtsAssessment {
  // A. Career profile
  careerStage: CareerStage | null;
  creativeField: CreativeField | null;
  yearsOfExperience: number | null;

  // B. Recognition
  internationalAwards: FrequencyAnswer | null;
  shortlistedAwards: FrequencyAnswer | null;
  soloExhibitions: FrequencyAnswer | null;
  groupExhibitions: FrequencyAnswer | null;
  publicPerformances: FrequencyAnswer | null;
  residencies: FrequencyAnswer | null;
  pressMediaCoverage: FrequencyAnswer | null;

  // C. Evidence strength
  hasOfficialProof: YesNoUnsure | null;
  hasPressLinks: YesNoUnsure | null;
  hasRecommenderSources: YesNoUnsure | null;
  recommendersAreSenior: YesNoUnsure | null;
  evidenceFromMultipleCountries: YesNoUnsure | null;

  // D. UK career plan
  hasUkCareerPlan: YesNoUnsure | null;
  hasUkConnections: YesNoUnsure | null;
  planToBuildInUk: YesNoUnsure | null;
}

export type AssessmentTier =
  | "strong-fit"
  | "possible-fit"
  | "needs-more"
  | "weak-fit";

export type RouteSuggestion =
  | "exceptional-talent"
  | "exceptional-promise"
  | "unclear";

export interface StrengthOrGap {
  title: string;
  description: string;
}

export interface AssessmentResult {
  score: number; // 0..100
  tier: AssessmentTier;
  routeSuggestion: RouteSuggestion;
  strengths: StrengthOrGap[];
  gaps: StrengthOrGap[];
  nextSteps: string[];
  checklist: { label: string; done: boolean }[];
}
