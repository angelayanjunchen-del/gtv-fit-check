import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  label: string;
  done: boolean;
}

interface EvidenceChecklistProps {
  items: ChecklistItem[];
  className?: string;
}

export function EvidenceChecklist({
  items,
  className,
}: EvidenceChecklistProps) {
  const completed = items.filter((i) => i.done).length;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {completed} of {items.length} likely ready
        </p>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className={cn(
              "group flex items-start gap-3 rounded-xl border border-border/70 bg-card/60 px-4 py-3 transition-colors",
              item.done && "border-success/30 bg-success/[0.04]"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors",
                item.done
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {item.done ? (
                <Check className="h-3 w-3" strokeWidth={3} />
              ) : (
                <Circle className="h-2.5 w-2.5" strokeWidth={3} />
              )}
            </span>
            <span
              className={cn(
                "text-sm leading-relaxed",
                item.done
                  ? "text-foreground"
                  : "text-foreground/85"
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
