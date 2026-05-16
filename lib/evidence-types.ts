export type EvidenceCategory =
  | "media-recognition"
  | "prize-nomination"
  | "exhibition-performance"
  | "recommendation-letter"
  | "cv-career-record"
  | "other-supporting";

export const EVIDENCE_CATEGORY_LABELS: Record<EvidenceCategory, string> = {
  "media-recognition": "International media recognition",
  "prize-nomination": "International prize / nomination / shortlist",
  "exhibition-performance": "International exhibition / appearance / performance",
  "recommendation-letter": "Recommendation letter source",
  "cv-career-record": "CV / career record",
  "other-supporting": "Other supporting material",
};

export const EVIDENCE_CATEGORY_SHORT: Record<EvidenceCategory, string> = {
  "media-recognition": "Media",
  "prize-nomination": "Prize",
  "exhibition-performance": "Exhibition",
  "recommendation-letter": "Letter",
  "cv-career-record": "CV",
  "other-supporting": "Other",
};

export type SourceAuthority =
  | "international-major"
  | "national-established"
  | "professional-respected"
  | "local-regional"
  | "self-published";

export const SOURCE_AUTHORITY_LABELS: Record<SourceAuthority, string> = {
  "international-major": "International / major institution",
  "national-established": "National / established organisation",
  "professional-respected": "Professional / respected outlet",
  "local-regional": "Local / regional",
  "self-published": "Self-published / personal",
};

export type RiskLevel =
  | "strong"
  | "usable"
  | "needs-proof"
  | "weak"
  | "needs-review";

export const RISK_LABELS: Record<RiskLevel, string> = {
  strong: "Strong evidence",
  usable: "Potentially usable",
  "needs-proof": "Needs supporting proof",
  weak: "Weak / risky evidence",
  "needs-review": "Needs expert review",
};

export const RISK_DESCRIPTIONS: Record<RiskLevel, string> = {
  strong:
    "This evidence appears well-aligned with endorsement expectations.",
  usable:
    "This evidence may support the case but could be strengthened.",
  "needs-proof":
    "This evidence requires stronger independent proof to be compelling.",
  weak:
    "This evidence carries risk and may not hold up under scrutiny.",
  "needs-review":
    "A qualified adviser should review this item before relying on it.",
};

export type EvidenceStatus = "done" | "intent";

export const STATUS_LABELS: Record<EvidenceStatus, string> = {
  done: "已有 · Have",
  intent: "意向 · Plan",
};

export interface EvidenceItem {
  id: string;
  status: EvidenceStatus;
  category: EvidenceCategory;
  title: string;
  organisation: string;
  country: string;
  date: string;
  linkOrUpload: string;
  applicantNameVisible: boolean | null;
  applicantRoleClear: boolean | null;
  workTitleVisible: boolean | null;
  wasCuratedOrSelected: boolean | null;
  withinLastFiveYears: boolean | null;
  hasThirdPartyProof: boolean | null;
  sourceAuthority: SourceAuthority | null;
  notes: string;

  // Recommender-specific fields (only for recommendation-letter)
  recommenderName: string;
  recommenderRole: string;
  recommenderIsSenior: boolean | null;
  recommenderIsUkBased: boolean | null;
  recommenderHasCollaborated: boolean | null;
  recommenderCollaborationProject: string;
  recommenderHasCredentials: boolean | null;
  recommenderCanUseLetterhead: boolean | null;
}

export interface ItemSuggestion {
  type: "missing" | "fix" | "tip";
  text: string;
}

export interface EvidenceScoreBreakdown {
  categoryMatch: number;       // 0..20
  sourceAuthority: number;     // 0..25
  applicantLinkage: number;    // 0..20
  internationality: number;    // 0..20
  documentation: number;       // 0..15
  total: number;               // 0..100
  risk: RiskLevel;
  suggestions: ItemSuggestion[];
}

export interface CaseCoverage {
  category: EvidenceCategory;
  count: number;
  avgScore: number;
  met: boolean;
}

export interface CaseReadiness {
  overallScore: number;           // 0..100
  tier: "strong" | "developing" | "early" | "incomplete";
  coverage: CaseCoverage[];
  letterReadiness: {
    count: number;
    target: number;
    avgScore: number;
    ready: boolean;
  };
  strengths: { title: string; description: string }[];
  risks: { title: string; description: string }[];
  nextActions: string[];
  suggestedPack: { slot: string; itemId: string | null; suggestion: string }[];
  countryCoverage: { country: string; count: number }[];
  narrative: string;
  intentCount: number;
}
