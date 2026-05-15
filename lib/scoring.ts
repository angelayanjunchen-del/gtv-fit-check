import type {
  ArtsAssessment,
  AssessmentResult,
  AssessmentTier,
  FrequencyAnswer,
  RouteSuggestion,
  StrengthOrGap,
  YesNoUnsure,
} from "./types";

const FREQ_WEIGHTS: Record<FrequencyAnswer, number> = {
  none: 0,
  few: 0.5,
  several: 0.85,
  many: 1,
};

const YN_WEIGHT = (v: YesNoUnsure | null, full: number) =>
  v === "yes" ? full : v === "unsure" ? full * 0.35 : 0;

const freqPoints = (v: FrequencyAnswer | null, full: number) =>
  v ? Math.round(FREQ_WEIGHTS[v] * full) : 0;

export function calculateScore(a: ArtsAssessment): number {
  let score = 0;

  // Recognition (max ≈ 75)
  score += freqPoints(a.internationalAwards, 20);
  score += freqPoints(a.shortlistedAwards, 10);
  score += freqPoints(a.soloExhibitions, 15);
  score += freqPoints(a.groupExhibitions, 8);
  score += freqPoints(a.publicPerformances, 8);
  score += freqPoints(a.residencies, 6);
  score += freqPoints(a.pressMediaCoverage, 12);

  // Evidence strength (max ≈ 35, can also deduct)
  score += YN_WEIGHT(a.hasOfficialProof, 8);
  score += YN_WEIGHT(a.hasPressLinks, 6);

  if (a.hasRecommenderSources === "yes") score += 8;
  else if (a.hasRecommenderSources === "no") score -= 15;

  if (a.recommendersAreSenior === "yes") score += 7;
  else if (a.recommendersAreSenior === "unsure") score += 2;

  score += YN_WEIGHT(a.evidenceFromMultipleCountries, 10);

  // UK plan (max ≈ 20)
  score += YN_WEIGHT(a.hasUkCareerPlan, 6);
  score += YN_WEIGHT(a.hasUkConnections, 4);
  score += YN_WEIGHT(a.planToBuildInUk, 4);

  // Penalty for weak documentation overall
  if (a.hasOfficialProof === "no" && a.hasPressLinks === "no") {
    score -= 10;
  }

  // Experience boost
  if (a.yearsOfExperience !== null) {
    if (a.yearsOfExperience >= 10) score += 6;
    else if (a.yearsOfExperience >= 5) score += 3;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function tierFromScore(score: number): AssessmentTier {
  if (score >= 80) return "strong-fit";
  if (score >= 60) return "possible-fit";
  if (score >= 40) return "needs-more";
  return "weak-fit";
}

export function suggestRoute(
  a: ArtsAssessment,
  score: number
): RouteSuggestion {
  const seniorRecognition =
    a.internationalAwards === "many" ||
    a.internationalAwards === "several" ||
    (a.soloExhibitions === "many" && a.pressMediaCoverage !== "none");

  const isEstablished = a.careerStage === "established";
  const strongMedia =
    a.pressMediaCoverage === "many" || a.pressMediaCoverage === "several";

  if (isEstablished && seniorRecognition && strongMedia && score >= 65) {
    return "exceptional-talent";
  }

  if (
    (a.careerStage === "emerging" || a.careerStage === "mid-career") &&
    score >= 45
  ) {
    return "exceptional-promise";
  }

  if (score >= 70) return "exceptional-talent";
  if (score >= 35) return "exceptional-promise";
  return "unclear";
}

const isStrong = (v: FrequencyAnswer | null) =>
  v === "several" || v === "many";

const isWeak = (v: FrequencyAnswer | null) => v === "none" || v === "few";

export function buildStrengths(a: ArtsAssessment): StrengthOrGap[] {
  const out: StrengthOrGap[] = [];

  if (isStrong(a.internationalAwards)) {
    out.push({
      title: "International recognition",
      description:
        "International awards or honours are strong evidence of standing in your field.",
    });
  }
  if (isStrong(a.soloExhibitions) || isStrong(a.publicPerformances)) {
    out.push({
      title: "Solo presence",
      description:
        "Curated solo shows or headline performances suggest individual recognition by professional venues.",
    });
  }
  if (isStrong(a.pressMediaCoverage)) {
    out.push({
      title: "Independent press coverage",
      description:
        "Coverage in respected publications helps demonstrate impact beyond your immediate network.",
    });
  }
  if (a.evidenceFromMultipleCountries === "yes") {
    out.push({
      title: "Cross-border evidence",
      description:
        "Activity recognised in more than one country signals international relevance.",
    });
  }
  if (
    a.hasRecommenderSources === "yes" &&
    a.recommendersAreSenior === "yes"
  ) {
    out.push({
      title: "Credible referees",
      description:
        "Senior, internationally known recommenders add significant weight to an application.",
    });
  }
  if (isStrong(a.residencies)) {
    out.push({
      title: "Selective residencies",
      description:
        "Competitive residency placements indicate peer-reviewed selection by your field.",
    });
  }
  if (a.hasUkCareerPlan === "yes" && a.hasUkConnections === "yes") {
    out.push({
      title: "UK-ready trajectory",
      description:
        "A clear UK plan with real collaborators or institutions strengthens the case for endorsement.",
    });
  }

  return out.slice(0, 3);
}

export function buildGaps(a: ArtsAssessment): StrengthOrGap[] {
  const out: StrengthOrGap[] = [];

  if (isWeak(a.internationalAwards) && isWeak(a.shortlistedAwards)) {
    out.push({
      title: "Limited awards profile",
      description:
        "Consider adding evidence of nominations, shortlistings or peer-selected honours over the last 5 years.",
    });
  }
  if (isWeak(a.pressMediaCoverage)) {
    out.push({
      title: "Sparse independent press",
      description:
        "Press in recognised publications strengthens an application. Consider pitching features or reviews.",
    });
  }
  if (a.hasOfficialProof === "no" || a.hasPressLinks === "no") {
    out.push({
      title: "Documentation gaps",
      description:
        "Achievements work best when supported by certificates, links, PDFs or letters. Start collecting now.",
    });
  }
  if (
    a.hasRecommenderSources === "no" ||
    a.recommendersAreSenior === "no"
  ) {
    out.push({
      title: "Recommender strength",
      description:
        "Three letters from senior, internationally recognised figures in your field are typically expected.",
    });
  }
  if (a.evidenceFromMultipleCountries === "no") {
    out.push({
      title: "Limited international footprint",
      description:
        "Evidence from a single country can read as regional. Consider international exhibitions, residencies or press.",
    });
  }
  if (
    a.hasUkCareerPlan === "no" ||
    a.hasUkConnections === "no" ||
    a.planToBuildInUk === "no"
  ) {
    out.push({
      title: "UK plan needs definition",
      description:
        "A specific UK plan — venues, collaborators, exhibitions or projects — makes the application more concrete.",
    });
  }
  if (isWeak(a.soloExhibitions) && isWeak(a.publicPerformances)) {
    out.push({
      title: "Few solo platforms",
      description:
        "Solo exhibitions, headline performances or commissioned work help demonstrate individual standing.",
    });
  }

  return out.slice(0, 3);
}

export function buildNextSteps(a: ArtsAssessment, tier: AssessmentTier) {
  const steps: string[] = [];

  if (tier === "weak-fit" || tier === "needs-more") {
    steps.push(
      "Map your career timeline — list each award, exhibition, residency or feature with dates and links."
    );
  }

  if (
    a.hasRecommenderSources !== "yes" ||
    a.recommendersAreSenior !== "yes"
  ) {
    steps.push(
      "Identify three potential referees who are senior, internationally recognised, and can speak to your work first-hand."
    );
  }

  if (a.hasOfficialProof !== "yes" || a.hasPressLinks !== "yes") {
    steps.push(
      "Build an evidence vault — store certificates, press articles, programme listings and contracts in one place."
    );
  }

  if (
    a.hasUkCareerPlan !== "yes" ||
    a.hasUkConnections !== "yes"
  ) {
    steps.push(
      "Draft a 1–2 page UK career plan describing where you want to work, with whom, and how it advances UK arts and culture."
    );
  }

  if (isWeak(a.pressMediaCoverage)) {
    steps.push(
      "Plan a press strategy for the next 12 months — pitch reviews, interviews or features in respected publications."
    );
  }

  steps.push(
    "Speak to a qualified immigration adviser before applying. This tool is for self-assessment only."
  );

  return steps.slice(0, 5);
}

export function buildChecklist(a: ArtsAssessment) {
  return [
    { label: "CV tailored to creative achievements (max 3 pages)", done: false },
    {
      label: "Personal statement with UK career plan",
      done: a.hasUkCareerPlan === "yes",
    },
    {
      label: "Three recommendation letters from senior referees",
      done:
        a.hasRecommenderSources === "yes" &&
        a.recommendersAreSenior === "yes",
    },
    {
      label: "Up to 10 pieces of supporting evidence (press, awards, programmes)",
      done: a.hasPressLinks === "yes" && a.hasOfficialProof === "yes",
    },
    {
      label: "Evidence of international activity (multiple countries)",
      done: a.evidenceFromMultipleCountries === "yes",
    },
    {
      label: "Mandatory criteria evidence (awards, recognition, or peer reviews)",
      done:
        isStrong(a.internationalAwards) ||
        isStrong(a.shortlistedAwards) ||
        isStrong(a.soloExhibitions),
    },
    { label: "Passport / identity document", done: false },
    {
      label: "Final review with a qualified immigration adviser",
      done: false,
    },
  ];
}

export function runScoring(a: ArtsAssessment): AssessmentResult {
  const score = calculateScore(a);
  const tier = tierFromScore(score);
  const routeSuggestion = suggestRoute(a, score);

  return {
    score,
    tier,
    routeSuggestion,
    strengths: buildStrengths(a),
    gaps: buildGaps(a),
    nextSteps: buildNextSteps(a, tier),
    checklist: buildChecklist(a),
  };
}

export const EMPTY_ASSESSMENT: ArtsAssessment = {
  careerStage: null,
  creativeField: null,
  yearsOfExperience: null,
  internationalAwards: null,
  shortlistedAwards: null,
  soloExhibitions: null,
  groupExhibitions: null,
  publicPerformances: null,
  residencies: null,
  pressMediaCoverage: null,
  hasOfficialProof: null,
  hasPressLinks: null,
  hasRecommenderSources: null,
  recommendersAreSenior: null,
  evidenceFromMultipleCountries: null,
  hasUkCareerPlan: null,
  hasUkConnections: null,
  planToBuildInUk: null,
};

export const DEMO_ASSESSMENT: ArtsAssessment = {
  careerStage: "mid-career",
  creativeField: "visual-arts",
  yearsOfExperience: 8,
  internationalAwards: "few",
  shortlistedAwards: "several",
  soloExhibitions: "several",
  groupExhibitions: "many",
  publicPerformances: "few",
  residencies: "several",
  pressMediaCoverage: "several",
  hasOfficialProof: "yes",
  hasPressLinks: "yes",
  hasRecommenderSources: "yes",
  recommendersAreSenior: "unsure",
  evidenceFromMultipleCountries: "yes",
  hasUkCareerPlan: "yes",
  hasUkConnections: "unsure",
  planToBuildInUk: "yes",
};
