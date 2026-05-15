import { cn } from "@/lib/utils";

type Tier = "strong" | "developing" | "early" | "incomplete";

const TIER_LABELS: Record<Tier, string> = {
  strong: "Case appears strong",
  developing: "Case is developing",
  early: "Early stage",
  incomplete: "Incomplete",
};

const TIER_DESCRIPTIONS: Record<Tier, string> = {
  strong:
    "Your evidence portfolio appears well-aligned with endorsement expectations. Consider a final review with an adviser.",
  developing:
    "A solid foundation is forming. Some areas may need strengthening before the case is ready.",
  early:
    "You have a starting point but significant work remains. Focus on the suggested next actions.",
  incomplete:
    "The case needs substantially more evidence. Use the builder to add and evaluate items.",
};

const TIER_COLOR: Record<Tier, string> = {
  strong: "text-success",
  developing: "text-primary",
  early: "text-warning",
  incomplete: "text-muted-foreground",
};

const TIER_STROKE: Record<Tier, string> = {
  strong: "stroke-success",
  developing: "stroke-primary",
  early: "stroke-warning",
  incomplete: "stroke-muted-foreground",
};

interface CaseReadinessMeterProps {
  score: number;
  tier: Tier;
  className?: string;
}

export function CaseReadinessMeter({
  score,
  tier,
  className,
}: CaseReadinessMeterProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
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
            className={cn(
              "fill-none transition-all duration-1000 ease-out",
              TIER_STROKE[tier]
            )}
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
            readiness
          </div>
        </div>
      </div>
      <div className="mt-5">
        <p className={cn("text-lg font-medium tracking-tight", TIER_COLOR[tier])}>
          {TIER_LABELS[tier]}
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {TIER_DESCRIPTIONS[tier]}
        </p>
      </div>
    </div>
  );
}
