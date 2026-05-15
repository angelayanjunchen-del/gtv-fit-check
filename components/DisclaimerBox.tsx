import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclaimerBoxProps {
  className?: string;
  variant?: "soft" | "outlined";
  title?: string;
  children?: React.ReactNode;
}

export function DisclaimerBox({
  className,
  variant = "soft",
  title = "Important",
  children,
}: DisclaimerBoxProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl p-5 text-sm leading-relaxed",
        variant === "soft"
          ? "bg-muted/70 text-muted-foreground"
          : "border border-border bg-card/60 text-muted-foreground",
        className
      )}
    >
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <div>
        <span className="font-medium text-foreground">{title}. </span>
        {children ?? (
          <>
            GTV Fit Check is an educational self-assessment tool. It does not
            provide legal or immigration advice and cannot guarantee visa
            approval, endorsement, or eligibility. Always consult a qualified
            immigration adviser before applying.
          </>
        )}
      </div>
    </div>
  );
}
