import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RISK_LABELS, type RiskLevel } from "@/lib/evidence-types";

const CONFIG: Record<
  RiskLevel,
  { variant: "success" | "gold" | "warning" | "destructive" | "muted"; icon: typeof Shield }
> = {
  strong: { variant: "success", icon: ShieldCheck },
  usable: { variant: "gold", icon: Shield },
  "needs-proof": { variant: "warning", icon: ShieldAlert },
  weak: { variant: "destructive", icon: AlertTriangle },
  "needs-review": { variant: "muted", icon: ShieldQuestion },
};

interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const { variant, icon: Icon } = CONFIG[risk];
  return (
    <Badge variant={variant} className={cn("gap-1.5 px-2.5", className)}>
      <Icon className="h-3 w-3" />
      {RISK_LABELS[risk]}
    </Badge>
  );
}
