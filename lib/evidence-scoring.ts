import type {
  EvidenceItem,
  EvidenceScoreBreakdown,
  EvidenceCategory,
  SourceAuthority,
  RiskLevel,
  CaseReadiness,
  CaseCoverage,
  ItemSuggestion,
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
  if (item.applicantNameVisible === true) applicantLinkage += 5;
  if (item.applicantRoleClear === true) applicantLinkage += 5;
  if (item.workTitleVisible === true) applicantLinkage += 5;
  if (item.wasCuratedOrSelected === true) applicantLinkage += 5;
  if (
    item.applicantNameVisible === null &&
    item.applicantRoleClear === null &&
    item.workTitleVisible === null
  )
    applicantLinkage = 5;

  // Recommender-specific linkage bonus
  if (item.category === "recommendation-letter") {
    if (item.recommenderIsSenior === true) applicantLinkage += 3;
    if (item.recommenderHasCollaborated === true) applicantLinkage += 2;
  }

  applicantLinkage = Math.min(20, applicantLinkage);

  let internationality = 0;
  const c = item.country.toLowerCase();
  if (c && c !== "uk" && c !== "united kingdom") {
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

  // Recommender documentation bonus
  if (item.category === "recommendation-letter") {
    if (item.recommenderCanUseLetterhead === true) documentation += 2;
    if (item.recommenderHasCredentials === true) documentation += 2;
    documentation = Math.min(15, documentation);
  }

  const total = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        categoryMatch +
          sourceAuthority +
          applicantLinkage +
          internationality +
          Math.max(0, documentation)
      )
    )
  );

  const risk = riskFromScore(total, item);
  const suggestions = buildItemSuggestions(item, {
    categoryMatch,
    sourceAuthority,
    applicantLinkage,
    internationality,
    documentation: Math.max(0, documentation),
    total,
    risk,
    suggestions: [],
  });

  return {
    categoryMatch,
    sourceAuthority,
    applicantLinkage,
    internationality,
    documentation: Math.max(0, documentation),
    total,
    risk,
    suggestions,
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

function buildItemSuggestions(
  item: EvidenceItem,
  score: Omit<EvidenceScoreBreakdown, "suggestions">
): ItemSuggestion[] {
  const out: ItemSuggestion[] = [];

  if (item.applicantNameVisible === false) {
    out.push({
      type: "missing",
      text: "Applicant name not visible. Add a confirmation letter or annotation showing your involvement.",
    });
  }

  if (item.applicantRoleClear === false) {
    out.push({
      type: "fix",
      text: "Applicant role unclear. Request a letter from the organiser confirming your specific contribution.",
    });
  }

  if (item.workTitleVisible === false) {
    out.push({
      type: "missing",
      text: "Work title not shown. Consider adding programme notes, a catalogue entry, or curatorial statement.",
    });
  }

  if (item.wasCuratedOrSelected === false && item.category === "exhibition-performance") {
    out.push({
      type: "tip",
      text: "This was not curated or selected. Open-call events carry less weight than invited or jury-selected ones.",
    });
  }

  if (item.sourceAuthority === "self-published") {
    out.push({
      type: "fix",
      text: "Self-published materials carry low authority. Pair this with independent press coverage, a review, or institutional confirmation.",
    });
  }

  if (item.sourceAuthority === "local-regional") {
    out.push({
      type: "tip",
      text: "Local/regional source. Consider adding stronger international or national-level evidence in the same category.",
    });
  }

  if (item.hasThirdPartyProof === false || item.hasThirdPartyProof === null) {
    out.push({
      type: "missing",
      text: "No independent third-party proof. Add an external link, official listing, or confirmation from the organising body.",
    });
  }

  if (item.withinLastFiveYears === false) {
    out.push({
      type: "tip",
      text: "This is older than 5 years. Evidence from the last 5 years is typically expected. Use this sparingly.",
    });
  }

  if (!item.linkOrUpload) {
    out.push({
      type: "missing",
      text: "No link or document attached. Add a URL, PDF, or screenshot for verification.",
    });
  }

  // Recommender-specific suggestions
  if (item.category === "recommendation-letter") {
    if (item.recommenderIsSenior === false || item.recommenderIsSenior === null) {
      out.push({
        type: "fix",
        text: "Recommender may not be senior enough. Letters from directors, professors, or internationally recognised figures carry more weight.",
      });
    }
    if (item.recommenderIsUkBased === false && item.recommenderIsUkBased !== null) {
      out.push({
        type: "tip",
        text: "This recommender is not UK-based. At least one letter should come from a UK-based established organisation.",
      });
    }
    if (item.recommenderHasCollaborated === false) {
      out.push({
        type: "fix",
        text: "Recommender has not collaborated with you directly. Letters are strongest when the writer can describe specific work together.",
      });
    }
    if (item.recommenderCanUseLetterhead === false || item.recommenderCanUseLetterhead === null) {
      out.push({
        type: "missing",
        text: "No institutional letterhead available. Letters on official letterhead with full contact details are expected.",
      });
    }
    if (item.recommenderHasCredentials === false || item.recommenderHasCredentials === null) {
      out.push({
        type: "tip",
        text: "Consider attaching a short bio or CV for this recommender to establish their standing.",
      });
    }
  }

  // Media-specific
  if (item.category === "media-recognition" && item.sourceAuthority === "professional-respected") {
    if (!item.notes.toLowerCase().includes("review") && !item.notes.toLowerCase().includes("critic")) {
      out.push({
        type: "tip",
        text: "If this is a review, note the critic name. Named critics in recognised publications are stronger than unsigned mentions.",
      });
    }
  }

  return out.slice(0, 4);
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
        ? Math.round(
            catItems.reduce((a, b) => a + b.score.total, 0) / catItems.length
          )
        : 0;
    return {
      category: cat,
      count: catItems.length,
      avgScore: avg,
      met: catItems.length >= CATEGORY_TARGETS[cat] && avg >= 40,
    };
  });

  const letters = scored.filter(
    (s) => s.item.category === "recommendation-letter"
  );
  const ukLetters = letters.filter(
    (l) => l.item.recommenderIsUkBased === true
  );
  const seniorLetters = letters.filter(
    (l) => l.item.recommenderIsSenior === true
  );
  const letterReadiness = {
    count: letters.length,
    target: 3,
    avgScore:
      letters.length > 0
        ? Math.round(
            letters.reduce((a, b) => a + b.score.total, 0) / letters.length
          )
        : 0,
    ready:
      letters.length >= 3 &&
      ukLetters.length >= 1 &&
      seniorLetters.length >= 2 &&
      letters.every((l) => l.score.total >= 45),
  };

  const metCount = coverage.filter((c) => c.met).length;
  const avgTotal =
    scored.length > 0
      ? Math.round(
          scored.reduce((a, b) => a + b.score.total, 0) / scored.length
        )
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

  // Country coverage
  const countryMap = new Map<string, number>();
  for (const s of scored) {
    const country = s.item.country.trim();
    if (country) {
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    }
  }
  const countryCoverage = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  const strengths = buildStrengths(scored, coverage, letterReadiness);
  const risks = buildRisks(scored, coverage, letterReadiness);
  const nextActions = buildNextActions(scored, coverage, letterReadiness);
  const suggestedPack = buildSuggestedPack(scored);
  const narrative = buildNarrative(
    scored,
    coverage,
    letterReadiness,
    countryCoverage,
    tier
  );

  return {
    overallScore,
    tier,
    coverage,
    letterReadiness,
    strengths,
    risks,
    nextActions,
    suggestedPack,
    countryCoverage,
    narrative,
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
      description: `${letters.count} letter sources identified, including UK-based and senior figures.`,
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

  const curatedItems = scored.filter(
    (s) => s.item.wasCuratedOrSelected === true
  );
  if (curatedItems.length >= 3) {
    out.push({
      title: "Curated or selected work",
      description: `${curatedItems.length} items were curated, jury-selected or invited — showing external validation.`,
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
    const reasons: string[] = [];
    if (letters.count < 3) reasons.push(`only ${letters.count} of 3 sources`);
    const ukCount = scored.filter(
      (s) =>
        s.item.category === "recommendation-letter" &&
        s.item.recommenderIsUkBased === true
    ).length;
    if (ukCount < 1) reasons.push("no UK-based recommender");
    const seniorCount = scored.filter(
      (s) =>
        s.item.category === "recommendation-letter" &&
        s.item.recommenderIsSenior === true
    ).length;
    if (seniorCount < 2) reasons.push("few senior recommenders");
    out.push({
      title: "Recommendation letters need attention",
      description:
        reasons.length > 0
          ? `Issues: ${reasons.join("; ")}. Three strong letters are typically expected.`
          : "Letter quality may need strengthening.",
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

  const selfPub = scored.filter(
    (s) => s.item.sourceAuthority === "self-published"
  );
  if (selfPub.length > 0) {
    out.push({
      title: "Self-published sources present",
      description: `${selfPub.length} item${selfPub.length > 1 ? "s rely" : " relies"} on self-published material. These should be supplementary only.`,
    });
  }

  const noName = scored.filter((s) => s.item.applicantNameVisible === false);
  if (noName.length > 0) {
    out.push({
      title: "Applicant name missing in some evidence",
      description: `${noName.length} item${noName.length > 1 ? "s do" : " does"} not clearly show your name. Add confirmation letters or annotations.`,
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
      `Identify ${3 - letters.count} more recommendation letter source${3 - letters.count > 1 ? "s" : ""} from senior, internationally recognised figures. At least one should be UK-based.`
    );
  }

  const unmet = coverage.filter((c) => !c.met);
  if (unmet.length > 0) {
    const labels: Record<string, string> = {
      "media-recognition": "media recognition",
      "prize-nomination": "prizes or nominations",
      "exhibition-performance": "exhibitions or performances",
      "recommendation-letter": "recommendation letters",
      "cv-career-record": "CV or career record",
    };
    const names = unmet.map((c) => labels[c.category] || c.category);
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

  const countries = new Set(scored.map((s) => s.item.country.toLowerCase().trim()));
  if (countries.size < 2) {
    actions.push(
      "Broaden international coverage. Evidence from at least 2 countries is typically expected for Exceptional Talent."
    );
  }

  actions.push(
    "Have a qualified immigration adviser review your evidence before finalising your application."
  );

  return actions.slice(0, 6);
}

const PACK_SLOTS = [
  {
    slot: "Mandatory criteria: major award or recognition",
    cats: ["prize-nomination", "media-recognition"] as EvidenceCategory[],
  },
  {
    slot: "Mandatory criteria: peer review or selection",
    cats: ["exhibition-performance", "prize-nomination"] as EvidenceCategory[],
  },
  {
    slot: "Optional criteria: media feature (1)",
    cats: ["media-recognition"] as EvidenceCategory[],
  },
  {
    slot: "Optional criteria: media feature (2)",
    cats: ["media-recognition"] as EvidenceCategory[],
  },
  {
    slot: "Optional criteria: exhibition / performance (1)",
    cats: ["exhibition-performance"] as EvidenceCategory[],
  },
  {
    slot: "Optional criteria: exhibition / performance (2)",
    cats: ["exhibition-performance"] as EvidenceCategory[],
  },
  {
    slot: "Recommendation letter (1 of 3)",
    cats: ["recommendation-letter"] as EvidenceCategory[],
  },
  {
    slot: "Recommendation letter (2 of 3)",
    cats: ["recommendation-letter"] as EvidenceCategory[],
  },
  {
    slot: "Recommendation letter (3 of 3)",
    cats: ["recommendation-letter"] as EvidenceCategory[],
  },
  {
    slot: "CV / career overview",
    cats: ["cv-career-record"] as EvidenceCategory[],
  },
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

function buildNarrative(
  scored: ScoredItem[],
  coverage: CaseCoverage[],
  letters: CaseReadiness["letterReadiness"],
  countries: { country: string; count: number }[],
  tier: CaseReadiness["tier"]
): string {
  const total = scored.length;
  if (total === 0) return "No evidence has been added yet.";

  const strong = scored.filter((s) => s.score.risk === "strong").length;
  const weak = scored.filter(
    (s) => s.score.risk === "weak" || s.score.risk === "needs-review"
  ).length;
  const metCats = coverage.filter((c) => c.met).length;
  const countryCount = countries.length;

  const parts: string[] = [];

  if (tier === "strong") {
    parts.push(
      `This portfolio contains ${total} evidence items, of which ${strong} appear strongly aligned with endorsement expectations.`
    );
  } else if (tier === "developing") {
    parts.push(
      `This portfolio contains ${total} evidence items and is developing well, though some areas may benefit from strengthening.`
    );
  } else {
    parts.push(
      `This portfolio contains ${total} evidence items. It is at an early stage and significant work remains before the case appears ready.`
    );
  }

  if (countryCount >= 3) {
    parts.push(
      `Evidence spans ${countryCount} countries, suggesting international reach.`
    );
  } else if (countryCount === 2) {
    parts.push(
      `Evidence covers ${countryCount} countries. Broadening international coverage may strengthen the case.`
    );
  } else {
    parts.push(
      "Evidence appears concentrated in a single country. International activity across multiple countries is typically expected."
    );
  }

  parts.push(
    `${metCats} of ${coverage.length} required evidence categories appear adequately covered.`
  );

  if (letters.ready) {
    parts.push(
      "Recommendation letter sources appear adequate, including senior and UK-based figures."
    );
  } else if (letters.count > 0) {
    parts.push(
      `${letters.count} of 3 recommendation letter sources have been identified. Strengthening this area is a priority.`
    );
  } else {
    parts.push(
      "No recommendation letter sources have been added yet. Three letters from senior figures are a critical requirement."
    );
  }

  if (weak > 0) {
    parts.push(
      `${weak} item${weak > 1 ? "s carry" : " carries"} risk and may need replacing or supporting with additional proof.`
    );
  }

  parts.push(
    "This is an educational indication only. A qualified immigration adviser should review the full case before any application."
  );

  return parts.join(" ");
}
