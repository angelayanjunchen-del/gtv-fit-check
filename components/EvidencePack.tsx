import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackSlot {
  slot: string;
  itemId: string | null;
  suggestion: string;
}

interface EvidencePackProps {
  slots: PackSlot[];
  className?: string;
}

export function EvidencePack({ slots, className }: EvidencePackProps) {
  const filled = slots.filter((s) => s.itemId !== null).length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="uppercase tracking-wider">
          Suggested 10-piece evidence pack
        </span>
        <span className="number-display">
          {filled} / {slots.length} filled
        </span>
      </div>
      <ol className="space-y-2">
        {slots.map((s, i) => (
          <li
            key={i}
            className={cn(
              "group flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
              s.itemId
                ? "border-success/30 bg-success/[0.04]"
                : "border-border bg-card/60"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                s.itemId
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {s.itemId ? (
                <Check className="h-3 w-3" strokeWidth={3} />
              ) : (
                <Circle className="h-2.5 w-2.5" strokeWidth={3} />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.slot}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-sm truncate",
                  s.itemId
                    ? "font-medium text-foreground"
                    : "text-muted-foreground italic"
                )}
              >
                {s.suggestion}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
