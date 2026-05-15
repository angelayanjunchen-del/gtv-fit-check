import type {
  EvidenceItem,
  EvidenceScoreBreakdown,
  EvidenceCategory,
  SourceAuthority,
  RiskLevel,
  CaseReadiness,
  CaseCoverage,
} from "./evidence-types";

const CATEGORY_WEIGHT: Record<EvidenceCategory, number> = {
  "media-recognition": 18,
  "prize-nomination": 20,
  "exhibition-performance": 16,
  "recommendation-letter": 17,
  "cv-career-record": 10,
  "other-supporting": 8,
};

const SOURCE_WEIGHT: Record<SourceAuthority, number> = {
  "international-major": 25,
  "national-established": 20,
  "professional-respected": 15,
  "local-regional": 8,
  "self-published": 3,
};

export function scoreEvidence(item: EvidenceItem): EvidenceScoreBreakdown {
  const categoryMatch = CATEGORY_WEIGHT[item.category];

  const sourceAuthority = item.sourceAuthority
    ? SOURCE_WEIGHT[item.sourceAuthority]
    : 5;

  let applicantLinkage = 0;
  if (item.applicantNameVisible === true) applicantLinkage += 10;
  if (item.applicantRoleClear === true) applicantLinkage += 10;
  if (item.applicantNameVisible === null && item.applicantRoleClear === null)
    applicantLinkage = 5;

  let internationality = 0;
  if (item.country && item.country.toLowerCase() !== "uk" && item.country.toLowerCase() !== "united kingdom") {
    internationality += 10;
  }
  if (
    item.sourceAuthority === "international-major" ||
    item.sourceAuthority === "national-established"
  ) {
    internationality += 10;
  } else if (item.sourceAuthority === "professional-respected") {
    internationality += 6;
  } else if (item.sourceAuthority === "local-regional") {
    internationality += 2;
  }

  let documentation = 0;
  if (item.linkOrUpload) documentation += 5;
  if (item.hasThirdPartyProof === true) documentation += 5;
  if (item.withinLastFiveYears === true) documentation += 5;
  if (item.withinLastFiveYears === false) documentation -= 2;

  const total = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        categoryMatch + sourceAuthority + applicantLinkage + internationality + documentation
      )
    )
  );

  return {
    categoryMatch,
    sourceAuthority,
    applicantLinkage,
    internationality,
    documentation: Math.max(0, documentation),
    total,
    risk: riskFromScore(total, item),
  };
}

function riskFromScore(score: number, item: EvidenceItem): RiskLevel {
  if (item.sourceAuthority === "self-published") return "weak";
  if (
    item.applicantNameVisible === false &&
    item.applicantRoleClear === false
  )
    return "needs-review";
  if (score >= 75) return "strong";
  if (score >= 55) return "usable";
  if (score >= 35) return "needs-proof";
  if (score >= 20) return "weak";
  return "needs-review";
}

const REQUIRED_CATEGORIES: EvidenceCategory[] = [
  "media-recognition",
  "prize-nomination",
  "exhibition-performance",
  "recommendation-letter",
  "cv-career-record",
];

const CATEGORY_TARGETS: Record<EvidenceCategory, number> = {
  "media-recognition": 2,
  "prize-nomination": 1,
  "exhibition-performance": 2,
  "recommendation-letter": 3,
  "cv-career-record": 1,
  "other-supporting": 0,
};

export function buildCaseReadiness(items: EvidenceItem[]): CaseReadiness {
  const scored = items.map((i) => ({ item: i, score: scoreEvidence(i) }));

  const coverage: CaseCoverage[] = REQUIRED_CATEGORIES.map((cat) => {
    const catItems = scored.filter((s) => s.item.category === cat);
    const avg =
      catItems.length > 0
        ? Math.round(catItems.reduce((a, b) => a + b.score.total, 0) / catItems.length)
        : 0;
    return {
      category: cat,
      count: catItems.length,
      avgScore: avg,
      met: catItems.length >= CATEGORY_TARGETS[cat] && avg >= 40,
    };
  });

  const letters = scored.filter((s) => s.item.category === "recommendation-letter");
  const letterReadiness = {
    count: letters.length,
    target: 3,
    avgScore:
      letters.length > 0
        ? Math.round(letters.reduce((a, b) => a + b.score.total, 0) / letters.length)
        : 0,
    ready: letters.length >= 3 && letters.every((l) => l.score.total >= 50),
  };

  const metCount = coverage.filter((c) => c.met).length;
  const avgTotal =
    scored.length > 0
      ? Math.round(scored.reduce((a, b) => a + b.score.total, 0) / scored.length)
      : 0;

  const overallScore = Math.min(
    100,
    Math.round(
      avgTotal * 0.5 +
        (metCount / REQUIRED_CATEGORIES.length) * 30 +
        (letterReadiness.ready ? 20 : letterReadiness.count * 4)
    )
  );

  const tier =
    overallScore >= 75
      ? "strong"
      : overallScore >= 55
        ? "developing"
        : overallScore >= 30
          ? "early"
          : "incomplete";

  const strengths = buildStrengths(scored, coverage, letterReadiness);
  const risks = buildRisks(scored, coverage, letterReadiness);
  const nextActions = buildNextActions(scored, coverage, letterReadiness);
  const suggestedPack = buildSuggestedPack(scored);

  return {
    overallScore,
    tier,
    coverage,
    letterReadiness,
    strengths,
    risks,
    nextActions,
    suggestedPack,
  };
}

type ScoredItem = { item: EvidenceItem; score: EvidenceScoreBreakdown };

function buildStrengths(
  scored: ScoredItem[],
  coverage: CaseCoverage[],
  letters: CaseReadiness["letterReadiness"]
) {
  const out: { title: string; description: string }[] = [];

  const strong = scored.filter((s) => s.score.risk === "strong");
  if (strong.length >= 3) {
    out.push({
      title: "Multiple strong evidence items",
      description: `${strong.length} items appear well-aligned with endorsement expectations.`,
    });
  }

  const intlMajor = scored.filter(
    (s) => s.item.sourceAuthority === "international-major"
  );
  if (intlMajor.length >= 2) {
    out.push({
      title: "International institutional presence",
      description:
        "Evidence from major international institutions signals significant standing in the field.",
    });
  }

  if (letters.ready) {
    out.push({
      title: "Recommendation letters appear ready",
      description: `${letters.count} letter sources identified, all scoring above threshold.`,
    });
  }

  const metCategories = coverage.filter((c) => c.met);
  if (metCategories.length >= 4) {
    out.push({
      title: "Broad evidence coverage",
      description: `${metCategories.length} of ${coverage.length} evidence categories appear well-covered.`,
    });
  }

  const recentItems = scored.filter(
    (s) => s.item.withinLastFiveYears === true
  );
  if (recentItems.length >= scored.length * 0.7 && scored.length > 0) {
    out.push({
      title: "Recent and current activity",
      description:
        "Most evidence is from the last five years, demonstrating an active and current practice.",
    });
  }

  return out.slice(0, 3);
}

function buildRisks(
  scored: ScoredItem[],
  coverage: CaseCoverage[],
  letters: CaseReadiness["letterReadiness"]
) {
  const out: { title: string; description: string }[] = [];

  const weak = scored.filter(
    (s) => s.score.risk === "weak" || s.score.risk === "needs-review"
  );
  if (weak.length > 0) {
    out.push({
      title: `${weak.length} item${weak.length > 1 ? "s" : ""} flagged as risky`,
      description:
        "These items may not hold up under scrutiny. Consider replacing or supporting them.",
    });
  }

  if (!letters.ready) {
    out.push({
      title: "Recommendation letters need attention",
      description:
        letters.count < 3
          ? `Only ${letters.count} of 3 letter sources identified. Three strong letters are typically expected.`
          : "Letter sources identified but average quality may need strengthening.",
    });
  }

  const unmet = coverage.filter((c) => !c.met);
  if (unmet.length > 0) {
    out.push({
      title: `${unmet.length} evidence categor${unmet.length > 1 ? "ies" : "y"} under-represented`,
      description:
        "Gaps in evidence categories may weaken the overall case. Consider adding items in missing areas.",
    });
  }

  const noProof = scored.filter(
    (s) => s.item.hasThirdPartyProof === false || s.item.hasThirdPartyProof === null
  );
  if (noProof.length > scored.length * 0.5 && scored.length > 0) {
    out.push({
      title: "Limited third-party verification",
      description:
        "Many items lack independent proof. Where possible, add external documentation.",
    });
  }

  const selfPub = scored.filter(
    (s) => s.item.sourceAuthority === "self-published"
  );
  if (selfPub.length > 0) {
    out.push({
      title: "Self-published sources present",
      description:
        "Self-published materials carry low authority. These should be treated as supplementary only.",
    });
  }

  return out.slice(0, 3);
}

function buildNextActions(
  scored: ScoredItem[],
  coverage: CaseCoverage[],
  letters: CaseReadiness["letterReadiness"]
) {
  const actions: string[] = [];

  if (scored.length < 10) {
    actions.push(
      `Add more evidence items. A typical strong dossier contains at least 10 pieces — you currently have ${scored.length}.`
    );
  }

  if (letters.count < 3) {
    actions.push(
      `Identify ${3 - letters.count} more recommendation letter source${3 - letters.count > 1 ? "s" : ""} from senior, internationally recognised figures.`
    );
  }

  const unmet = coverage.filter((c) => !c.met);
  if (unmet.length > 0) {
    const names = unmet.map((c) => {
      const labels: Record<string, string> = {
        "media-recognition": "media recognition",
        "prize-nomination": "prizes or nominations",
        "exhibition-performance": "exhibitions or performances",
        "recommendation-letter": "recommendation letters",
        "cv-career-record": "CV or career record",
      };
      return labels[c.category] || c.category;
    });
    actions.push(`Strengthen coverage in: ${names.join(", ")}.`);
  }

  const needsProof = scored.filter((s) => s.score.risk === "needs-proof");
  if (needsProof.length > 0) {
    actions.push(
      `${needsProof.length} item${needsProof.length > 1 ? "s need" : " needs"} supporting proof — add third-party documentation, links, or PDFs.`
    );
  }

  const weak = scored.filter(
    (s) => s.score.risk === "weak" || s.score.risk === "needs-review"
  );
  if (weak.length > 0) {
    actions.push(
      `Review or replace ${weak.length} weak/risky item${weak.length > 1 ? "s" : ""}. Consider whether stronger alternatives exist.`
    );
  }

  actions.push(
    "Have a qualified immigration adviser review your evidence before finalising your application."
  );

  return actions.slice(0, 6);
}

const PACK_SLOTS = [
  { slot: "Mandatory criteria: major award or recognition", cats: ["prize-nomination", "media-recognition"] as EvidenceCategory[] },
  { slot: "Mandatory criteria: peer review or selection", cats: ["exhibition-performance", "prize-nomination"] as EvidenceCategory[] },
  { slot: "Optional criteria: media feature (1)", cats: ["media-recognition"] as EvidenceCategory[] },
  { slot: "Optional criteria: media feature (2)", cats: ["media-recognition"] as EvidenceCategory[] },
  { slot: "Optional criteria: exhibition / performance (1)", cats: ["exhibition-performance"] as EvidenceCategory[] },
  { slot: "Optional criteria: exhibition / performance (2)", cats: ["exhibition-performance"] as EvidenceCategory[] },
  { slot: "Recommendation letter (1 of 3)", cats: ["recommendation-letter"] as EvidenceCategory[] },
  { slot: "Recommendation letter (2 of 3)", cats: ["recommendation-letter"] as EvidenceCategory[] },
  { slot: "Recommendation letter (3 of 3)", cats: ["recommendation-letter"] as EvidenceCategory[] },
  { slot: "CV / career overview", cats: ["cv-career-record"] as EvidenceCategory[] },
];

function buildSuggestedPack(scored: ScoredItem[]) {
  const used = new Set<string>();

  return PACK_SLOTS.map(({ slot, cats }) => {
    const candidates = scored
      .filter((s) => cats.includes(s.item.category) && !used.has(s.item.id))
      .sort((a, b) => b.score.total - a.score.total);

    const best = candidates[0];
    if (best) {
      used.add(best.item.id);
      return { slot, itemId: best.item.id, suggestion: best.item.title };
    }
    return { slot, itemId: null, suggestion: "Not yet added" };
  });
}
