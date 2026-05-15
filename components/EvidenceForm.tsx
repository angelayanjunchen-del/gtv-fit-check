"use client";

import * as React from "react";
import {
  FileText,
  Globe,
  Calendar,
  Building2,
  Link as LinkIcon,
  StickyNote,
  User,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionCard } from "@/components/QuestionCard";
import {
  EVIDENCE_CATEGORY_LABELS,
  SOURCE_AUTHORITY_LABELS,
  type EvidenceCategory,
  type EvidenceItem,
  type SourceAuthority,
} from "@/lib/evidence-types";

interface EvidenceFormProps {
  onSubmit: (item: EvidenceItem) => void;
  onCancel: () => void;
}

const DEFAULT: Omit<EvidenceItem, "id"> = {
  category: "media-recognition",
  title: "",
  organisation: "",
  country: "",
  date: "",
  linkOrUpload: "",
  applicantNameVisible: null,
  applicantRoleClear: null,
  workTitleVisible: null,
  wasCuratedOrSelected: null,
  withinLastFiveYears: null,
  hasThirdPartyProof: null,
  sourceAuthority: null,
  notes: "",
  recommenderName: "",
  recommenderRole: "",
  recommenderIsSenior: null,
  recommenderIsUkBased: null,
  recommenderHasCollaborated: null,
  recommenderCollaborationProject: "",
  recommenderHasCredentials: null,
  recommenderCanUseLetterhead: null,
};

const BOOL_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export function EvidenceForm({ onSubmit, onCancel }: EvidenceFormProps) {
  const [data, setData] = React.useState(DEFAULT);
  const isLetter = data.category === "recommendation-letter";

  const set = <K extends keyof typeof data>(key: K, val: (typeof data)[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const setBool = (key: keyof typeof data) => (v: string) =>
    set(key, v === "yes" as never);

  const boolVal = (v: boolean | null) =>
    v === true ? "yes" : v === false ? "no" : null;

  const canSubmit =
    data.title.trim() !== "" &&
    data.organisation.trim() !== "" &&
    data.country.trim() !== "" &&
    data.sourceAuthority !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      ...data,
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    });
  };

  return (
    <div className="space-y-6">
      <QuestionCard
        name="category"
        label="Evidence type"
        hint="What kind of evidence is this?"
        value={data.category}
        onChange={(v) => set("category", v as EvidenceCategory)}
        options={Object.entries(EVIDENCE_CATEGORY_LABELS).map(
          ([value, label]) => ({ value, label })
        )}
      />

      <Card>
        <CardContent className="p-6 space-y-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            Details
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder='e.g. "Solo exhibition at Tate Modern"'
                value={data.title}
                onChange={(e) => set("title", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="organisation" className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Organisation / institution
              </Label>
              <Input
                id="organisation"
                placeholder="e.g. Tate Modern"
                value={data.organisation}
                onChange={(e) => set("organisation", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="country" className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Country
              </Label>
              <Input
                id="country"
                placeholder="e.g. United Kingdom"
                value={data.country}
                onChange={(e) => set("country", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="date" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Date (approximate)
              </Label>
              <Input
                id="date"
                placeholder="e.g. 2024-06"
                value={data.date}
                onChange={(e) => set("date", e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="link" className="flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" />
              Link or upload reference
            </Label>
            <Input
              id="link"
              placeholder="https://... or filename.pdf"
              value={data.linkOrUpload}
              onChange={(e) => set("linkOrUpload", e.target.value)}
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Paste a URL or describe the file you would attach.
            </p>
          </div>
        </CardContent>
      </Card>

      <QuestionCard
        name="sourceAuthority"
        label="Source authority"
        hint="How would you classify this source?"
        value={data.sourceAuthority}
        onChange={(v) => set("sourceAuthority", v as SourceAuthority)}
        options={Object.entries(SOURCE_AUTHORITY_LABELS).map(
          ([value, label]) => ({ value, label })
        )}
      />

      {/* Verification questions */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Identity &amp; contribution proof
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <QuestionCard
              name="nameVisible"
              label="Is your name clearly visible?"
              value={boolVal(data.applicantNameVisible)}
              onChange={setBool("applicantNameVisible")}
              options={BOOL_OPTIONS}
              layout="grid"
            />
            <QuestionCard
              name="roleClear"
              label="Is your role clear?"
              hint="Artist, performer, author, director..."
              value={boolVal(data.applicantRoleClear)}
              onChange={setBool("applicantRoleClear")}
              options={BOOL_OPTIONS}
              layout="grid"
            />
            <QuestionCard
              name="workTitleVisible"
              label="Is the work title shown?"
              hint="Can someone see which specific work this refers to?"
              value={boolVal(data.workTitleVisible)}
              onChange={setBool("workTitleVisible")}
              options={BOOL_OPTIONS}
              layout="grid"
            />
            <QuestionCard
              name="wasCurated"
              label="Was this curated or selected?"
              hint="Jury-selected, invited, or peer-reviewed?"
              value={boolVal(data.wasCuratedOrSelected)}
              onChange={setBool("wasCuratedOrSelected")}
              options={BOOL_OPTIONS}
              layout="grid"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-3">
        <QuestionCard
          name="lastFiveYears"
          label="Within the last 5 years?"
          value={boolVal(data.withinLastFiveYears)}
          onChange={setBool("withinLastFiveYears")}
          options={BOOL_OPTIONS}
          layout="grid"
        />
        <QuestionCard
          name="thirdParty"
          label="Independent third-party proof?"
          hint="External verification beyond your own records?"
          value={boolVal(data.hasThirdPartyProof)}
          onChange={setBool("hasThirdPartyProof")}
          options={BOOL_OPTIONS}
          layout="grid"
        />
      </div>

      {/* Recommender Evaluator — only for recommendation letters */}
      {isLetter && (
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Badge variant="muted" className="gap-1.5">
                <User className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wider">
                  Recommender Evaluator
                </span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Strong letters come from senior, internationally recognised
              figures who have worked with you directly. At least one should
              be UK-based.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="recName" className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Recommender name
                </Label>
                <Input
                  id="recName"
                  placeholder="Full name"
                  value={data.recommenderName}
                  onChange={(e) => set("recommenderName", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="recRole" className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  Role / title
                </Label>
                <Input
                  id="recRole"
                  placeholder="e.g. Director, Curator, Professor"
                  value={data.recommenderRole}
                  onChange={(e) => set("recommenderRole", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <QuestionCard
                name="recSenior"
                label="Is this person senior in the field?"
                hint="Director, professor, established curator, etc."
                value={boolVal(data.recommenderIsSenior)}
                onChange={setBool("recommenderIsSenior")}
                options={BOOL_OPTIONS}
                layout="grid"
              />
              <QuestionCard
                name="recUk"
                label="Are they UK-based?"
                hint="At least one letter should come from a UK organisation."
                value={boolVal(data.recommenderIsUkBased)}
                onChange={setBool("recommenderIsUkBased")}
                options={BOOL_OPTIONS}
                layout="grid"
              />
              <QuestionCard
                name="recCollab"
                label="Have they worked with you directly?"
                value={boolVal(data.recommenderHasCollaborated)}
                onChange={setBool("recommenderHasCollaborated")}
                options={BOOL_OPTIONS}
                layout="grid"
              />
              <QuestionCard
                name="recCreds"
                label="Can they provide a CV or bio?"
                hint="To establish their own standing in the field."
                value={boolVal(data.recommenderHasCredentials)}
                onChange={setBool("recommenderHasCredentials")}
                options={BOOL_OPTIONS}
                layout="grid"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="recProject">
                  Collaboration project (if applicable)
                </Label>
                <Input
                  id="recProject"
                  placeholder="e.g. Solo exhibition 2024"
                  value={data.recommenderCollaborationProject}
                  onChange={(e) =>
                    set("recommenderCollaborationProject", e.target.value)
                  }
                  className="mt-1.5"
                />
              </div>
              <QuestionCard
                name="recLetterhead"
                label="Can they use official letterhead?"
                hint="Signed, dated, with contact details."
                value={boolVal(data.recommenderCanUseLetterhead)}
                onChange={setBool("recommenderCanUseLetterhead")}
                options={BOOL_OPTIONS}
                layout="grid"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <Label htmlFor="notes" className="flex items-center gap-1.5">
            <StickyNote className="h-3.5 w-3.5" />
            Notes (optional)
          </Label>
          <textarea
            id="notes"
            className="mt-1.5 flex min-h-[80px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            placeholder="Any context that helps evaluate this evidence..."
            value={data.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit} size="lg">
          Add evidence item
        </Button>
      </div>
    </div>
  );
}
