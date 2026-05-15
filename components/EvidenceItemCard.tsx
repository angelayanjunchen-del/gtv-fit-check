"use client";

import {
  Building2,
  Calendar,
  Globe,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/RiskBadge";
import { cn } from "@/lib/utils";
import {
  EVIDENCE_CATEGORY_SHORT,
  type EvidenceItem,
  type EvidenceScoreBreakdown,
} from "@/lib/evidence-types";

interface EvidenceItemCardProps {
  item: EvidenceItem;
  score: EvidenceScoreBreakdown;
  onRemove?: (id: string) => void;
}

const SCORE_BAR_LABELS = [
  { key: "categoryMatch" as const, label: "Category", max: 20 },
  { key: "sourceAuthority" as const, label: "Source", max: 25 },
  { key: "applicantLinkage" as const, label: "Linkage", max: 20 },
  { key: "internationality" as const, label: "International", max: 20 },
  { key: "documentation" as const, label: "Docs", max: 15 },
];

export function EvidenceItemCard({
  item,
  score,
  onRemove,
}: EvidenceItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        score.risk === "strong" && "border-success/30",
        score.risk === "weak" && "border-destructive/30",
        score.risk === "needs-review" && "border-muted-foreground/30"
      )}
    >
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted" className="text-[10px] uppercase tracking-wider">
                {EVIDENCE_CATEGORY_SHORT[item.category]}
              </Badge>
              <RiskBadge risk={score.risk} />
            </div>

            <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground line-clamp-2">
              {item.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {item.organisation}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {item.country}
              </span>
              {item.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </span>
              )}
              {item.linkOrUpload && (
                <span className="flex items-center gap-1 text-primary">
                  <ExternalLink className="h-3 w-3" />
                  Link
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <span className="number-display text-lg font-semibold text-foreground">
                {score.total}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {expanded ? (
            <>
              Hide breakdown <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Score breakdown <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2.5 animate-fade-in">
            {SCORE_BAR_LABELS.map(({ key, label, max }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-20 text-xs text-muted-foreground text-right">
                  {label}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      score[key] / max >= 0.7 ? "bg-success" :
                      score[key] / max >= 0.4 ? "bg-gold" : "bg-muted-foreground"
                    )}
                    style={{ width: `${(score[key] / max) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-xs text-muted-foreground number-display text-right">
                  {score[key]}/{max}
                </span>
              </div>
            ))}

            {item.notes && (
              <p className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-3">
                {item.notes}
              </p>
            )}

            {onRemove && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
