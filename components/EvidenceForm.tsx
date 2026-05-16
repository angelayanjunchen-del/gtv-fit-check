"use client";

import * as React from "react";
import {
  Globe,
  Link as LinkIcon,
  User,
  Briefcase,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  EVIDENCE_CATEGORY_LABELS,
  SOURCE_AUTHORITY_LABELS,
  type EvidenceCategory,
  type EvidenceItem,
  type EvidenceStatus,
  type SourceAuthority,
} from "@/lib/evidence-types";

interface EvidenceFormProps {
  onSubmit: (item: EvidenceItem) => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS: { value: EvidenceCategory; label: string; sub: string }[] = [
  { value: "media-recognition", label: "Media", sub: "Press / review / interview" },
  { value: "prize-nomination", label: "Prize", sub: "Award / nomination / grant" },
  { value: "exhibition-performance", label: "Show", sub: "Exhibition / performance" },
  { value: "recommendation-letter", label: "Referee", sub: "Recommendation letter" },
  { value: "cv-career-record", label: "CV", sub: "Career record" },
  { value: "other-supporting", label: "Other", sub: "Supporting material" },
];

export function EvidenceForm({ onSubmit, onCancel }: EvidenceFormProps) {
  const [status, setStatus] = React.useState<EvidenceStatus>("done");
  const [category, setCategory] = React.useState<EvidenceCategory>("media-recognition");
  const [url, setUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [org, setOrg] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [sourceAuthority, setSourceAuthority] = React.useState<SourceAuthority | null>(null);

  const [recName, setRecName] = React.useState("");
  const [recRole, setRecRole] = React.useState("");
  const [recRelation, setRecRelation] = React.useState("");

  const isLetter = category === "recommendation-letter";

  const canSubmit = isLetter
    ? recName.trim() !== ""
    : url.trim() !== "" || title.trim() !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;

    const item: EvidenceItem = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status,
      category,
      title: isLetter ? `Letter from ${recName}` : title,
      organisation: isLetter ? org : org,
      country,
      date: "",
      linkOrUpload: url,
      applicantNameVisible: null,
      applicantRoleClear: null,
      workTitleVisible: null,
      wasCuratedOrSelected: null,
      withinLastFiveYears: null,
      hasThirdPartyProof: url ? true : null,
      sourceAuthority,
      notes: isLetter ? recRelation : notes,
      recommenderName: isLetter ? recName : "",
      recommenderRole: isLetter ? recRole : "",
      recommenderIsSenior: null,
      recommenderIsUkBased: null,
      recommenderHasCollaborated: recRelation ? true : null,
      recommenderCollaborationProject: isLetter ? recRelation : "",
      recommenderHasCredentials: null,
      recommenderCanUseLetterhead: null,
    };
    onSubmit(item);
  };

  return (
    <div className="space-y-5">
      {/* Status toggle */}
      <div className="flex overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setStatus("done")}
          className={cn(
            "flex-1 py-4 text-center text-sm font-semibold transition-colors",
            status === "done"
              ? "bg-foreground text-background"
              : "bg-card text-muted-foreground hover:bg-muted/50"
          )}
        >
          <span className="block text-base">已有</span>
          <span className="mt-0.5 block text-[10px] uppercase tracking-wider opacity-70">
            Already happened
          </span>
        </button>
        <button
          type="button"
          onClick={() => setStatus("intent")}
          className={cn(
            "flex-1 border-l border-border py-4 text-center text-sm font-semibold transition-colors",
            status === "intent"
              ? "bg-foreground text-gold"
              : "bg-card text-muted-foreground hover:bg-muted/50"
          )}
        >
          <span className="block text-base">意向</span>
          <span className="mt-0.5 block text-[10px] uppercase tracking-wider opacity-70">
            Future target
          </span>
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {status === "done"
          ? "Fill in details of evidence you already have. The system evaluates its strength against ACE criteria."
          : "Describe evidence you plan to get in the next 3–6 months. The system checks if the target meets ACE standards."}
      </p>

      {/* Category */}
      <div className="grid grid-cols-3 gap-0 overflow-hidden rounded-xl border border-border sm:grid-cols-6">
        {CATEGORY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setCategory(opt.value)}
            className={cn(
              "border-r border-b border-border px-3 py-3.5 text-left transition-colors last:border-r-0 sm:[&:nth-child(6)]:border-r-0",
              category === opt.value
                ? "bg-foreground text-background"
                : "bg-card hover:bg-muted/50"
            )}
          >
            <span className="block text-xs font-bold">{opt.label}</span>
            <span className={cn(
              "mt-0.5 block text-[9px] uppercase tracking-wider",
              category === opt.value ? "opacity-60" : "text-muted-foreground"
            )}>
              {opt.sub}
            </span>
          </button>
        ))}
      </div>

      {/* Form fields */}
      <Card>
        <CardContent className="space-y-4 p-5">
          {isLetter ? (
            <>
              <div>
                <Label htmlFor="recName" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <User className="h-3 w-3" />
                  {status === "done" ? "Recommender name" : "Target recommender"} *
                </Label>
                <Input
                  id="recName"
                  placeholder={status === "done" ? "Dr. Sarah Wilson" : "e.g. Senior Curator at Whitechapel"}
                  value={recName}
                  onChange={(e) => setRecName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="recRole" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <Briefcase className="h-3 w-3" />
                  Role + institution
                </Label>
                <Input
                  id="recRole"
                  placeholder="e.g. Director, Serpentine Galleries"
                  value={recRole}
                  onChange={(e) => setRecRole(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="recUrl" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <LinkIcon className="h-3 w-3" />
                  Profile link
                </Label>
                <Input
                  id="recUrl"
                  placeholder="https://institution.org/person or LinkedIn"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="recRelation" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  {status === "done" ? "Relationship / projects together" : "How you plan to connect"}
                </Label>
                <textarea
                  id="recRelation"
                  className="mt-1.5 flex min-h-[72px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                  placeholder={status === "done"
                    ? "e.g. Curated my solo show in 2024, selected 3 works"
                    : "e.g. Plan to apply for their residency programme"
                  }
                  value={recRelation}
                  onChange={(e) => setRecRelation(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="url" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <LinkIcon className="h-3 w-3" />
                  Link *
                </Label>
                <Input
                  id="url"
                  placeholder={status === "done"
                    ? "https://... paste the article, listing, or announcement"
                    : "https://... link to the target venue, prize, or publication"
                  }
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1.5"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {status === "done"
                    ? "The link is how strength and authority get verified."
                    : "Link to the target so the system can check if it meets ACE standards."}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Title / description
                  </Label>
                  <Input
                    id="title"
                    placeholder={
                      category === "media-recognition" ? "e.g. Solo show review in Frieze" :
                      category === "prize-nomination" ? "e.g. Max Mara Art Prize shortlist" :
                      category === "exhibition-performance" ? "e.g. Solo exhibition at Tate Modern" :
                      "e.g. Artist CV, 3 pages"
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="org" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Organisation
                  </Label>
                  <Input
                    id="org"
                    placeholder="e.g. Tate Modern, Frieze, Art Basel"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="country" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    Country
                  </Label>
                  <Input
                    id="country"
                    placeholder="e.g. United Kingdom"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Source authority
                  </Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-border text-[10px]">
                    {(Object.entries(SOURCE_AUTHORITY_LABELS) as [SourceAuthority, string][]).slice(0, 4).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSourceAuthority(val)}
                        className={cn(
                          "border-r border-b border-border px-2 py-2 text-left transition-colors",
                          sourceAuthority === val
                            ? "bg-foreground text-background font-medium"
                            : "hover:bg-muted/50"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="notes" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Notes
                </Label>
                <textarea
                  id="notes"
                  className="mt-1.5 flex min-h-[60px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                  placeholder={status === "done"
                    ? "Any context that helps evaluate this evidence..."
                    : "Your plan — timeline, contacts, how you intend to get this..."
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Status hint */}
      {status === "intent" && (
        <div className="rounded-xl border border-gold/30 bg-gold/8 px-4 py-3 text-xs text-foreground/80">
          <span className="font-semibold">Intent items</span> are scored
          differently &mdash; they show whether your target meets ACE standards,
          not whether you have the evidence yet.
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit} size="lg">
          {status === "done" ? "Add evidence" : "Add target"}
        </Button>
      </div>
    </div>
  );
}
