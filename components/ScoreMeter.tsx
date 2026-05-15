import { cn } from "@/lib/utils";
import type { AssessmentTier } from "@/lib/types";

interface ScoreMeterProps {
  score: number; // 0..100
  tier: AssessmentTier;
  className?: string;
}

const TIER_LABELS: Record<AssessmentTier, string> = {
  "strong-fit": "Strong potential fit",
  "possible-fit": "Possible fit",
  "needs-more": "Needs more evidence",
  "weak-fit": "Weak fit",
};

const TIER_COLOR: Record<AssessmentTier, string> = {
  "strong-fit": "text-success",
  "possible-fit": "text-primary",
  "needs-more": "text-warning",
  "weak-fit": "text-muted-foreground",
};

const TIER_STROKE: Record<AssessmentTier, string> = {
  "strong-fit": "stroke-success",
  "possible-fit": "stroke-primary",
  "needs-more": "stroke-warning",
  "weak-fit": "stroke-muted-foreground",
};

export function ScoreMeter({ score, tier, className }: ScoreMeterProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        className
      )}
    >
      <div className="relative h-48 w-48">
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="fill-none stroke-muted"
            strokeWidth="10"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            className={cn("fill-none transition-all duration-1000 ease-out", TIER_STROKE[tier])}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-semibold number-display text-foreground">
            {clamped}
          </div>
          <div className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
            out of 100
          </div>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Evidence indication
        </p>
        <p
          className={cn(
            "mt-1 text-lg font-medium tracking-tight",
            TIER_COLOR[tier]
          )}
        >
          {TIER_LABELS[tier]}
        </p>
      </div>
    </div>
  );
}
