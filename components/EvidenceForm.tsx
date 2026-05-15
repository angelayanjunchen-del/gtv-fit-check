"use client";

import * as React from "react";
import {
  FileText,
  Globe,
  Calendar,
  Building2,
  Link as LinkIcon,
  StickyNote,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  withinLastFiveYears: null,
  hasThirdPartyProof: null,
  sourceAuthority: null,
  notes: "",
};

export function EvidenceForm({ onSubmit, onCancel }: EvidenceFormProps) {
  const [data, setData] = React.useState(DEFAULT);

  const set = <K extends keyof typeof data>(key: K, val: (typeof data)[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

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

      <div className="grid gap-6 sm:grid-cols-2">
        <QuestionCard
          name="nameVisible"
          label="Is your name clearly visible?"
          hint="Can someone see your full name in this evidence?"
          value={
            data.applicantNameVisible === true
              ? "yes"
              : data.applicantNameVisible === false
                ? "no"
                : null
          }
          onChange={(v) => set("applicantNameVisible", v === "yes")}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          layout="grid"
        />
        <QuestionCard
          name="roleClear"
          label="Is your role clear?"
          hint="Is it obvious what you did — artist, performer, author?"
          value={
            data.applicantRoleClear === true
              ? "yes"
              : data.applicantRoleClear === false
                ? "no"
                : null
          }
          onChange={(v) => set("applicantRoleClear", v === "yes")}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          layout="grid"
        />
        <QuestionCard
          name="lastFiveYears"
          label="Within the last 5 years?"
          value={
            data.withinLastFiveYears === true
              ? "yes"
              : data.withinLastFiveYears === false
                ? "no"
                : null
          }
          onChange={(v) => set("withinLastFiveYears", v === "yes")}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          layout="grid"
        />
        <QuestionCard
          name="thirdParty"
          label="Independent third-party proof?"
          hint="Is there verification from someone other than you?"
          value={
            data.hasThirdPartyProof === true
              ? "yes"
              : data.hasThirdPartyProof === false
                ? "no"
                : null
          }
          onChange={(v) => set("hasThirdPartyProof", v === "yes")}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          layout="grid"
        />
      </div>

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
