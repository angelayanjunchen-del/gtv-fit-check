import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EVIDENCE_CATEGORY_SHORT,
  type EvidenceCategory,
} from "@/lib/evidence-types";
import type { CaseCoverage } from "@/lib/evidence-types";

interface CategoryCoverageProps {
  coverage: CaseCoverage[];
  className?: string;
}

export function CategoryCoverage({
  coverage,
  className,
}: CategoryCoverageProps) {
  const met = coverage.filter((c) => c.met).length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="uppercase tracking-wider">Evidence coverage</span>
        <span className="number-display">
          {met} / {coverage.length} met
        </span>
      </div>
      <div className="space-y-2">
        {coverage.map((c) => (
          <div
            key={c.category}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors",
              c.met
                ? "border-success/30 bg-success/[0.04]"
                : c.count > 0
                  ? "border-warning/30 bg-warning/[0.04]"
                  : "border-border bg-card/60"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  c.met
                    ? "bg-success text-success-foreground"
                    : c.count > 0
                      ? "bg-warning/20 text-warning"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {c.met ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : c.count > 0 ? (
                  c.count
                ) : (
                  <X className="h-3 w-3" strokeWidth={3} />
                )}
              </span>
              <span className="text-sm font-medium text-foreground">
                {EVIDENCE_CATEGORY_SHORT[c.category]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="number-display">
                {c.count} item{c.count !== 1 ? "s" : ""}
              </span>
              {c.count > 0 && (
                <span className="number-display">avg {c.avgScore}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
