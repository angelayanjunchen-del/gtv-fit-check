"use client";

import Link from "next/link";
import {
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Package,
  Mail,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CaseReadinessMeter } from "./CaseReadinessMeter";
import { CategoryCoverage } from "./CategoryCoverage";
import { EvidencePack } from "./EvidencePack";
import { DisclaimerBox } from "./DisclaimerBox";
import { cn } from "@/lib/utils";
import type { CaseReadiness } from "@/lib/evidence-types";

interface EvidenceDashboardProps {
  readiness: CaseReadiness;
  totalItems: number;
}

export function EvidenceDashboard({
  readiness,
  totalItems,
}: EvidenceDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="absolute inset-0 -z-0 bg-grain opacity-80" />
        <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="muted" className="gap-1.5 px-2.5">
                <BarChart3 className="h-3 w-3 text-primary" />
                <span className="text-[10px] uppercase tracking-wider">
                  Evidence dashboard
                </span>
              </Badge>
              <Badge variant="muted" className="text-[10px] uppercase tracking-wider">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </Badge>
            </div>

            <h1 className="editorial-heading mt-6 text-balance text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Your evidence portfolio
              <br />
              <span className="italic text-primary/85">at a glance.</span>
            </h1>

            <p className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
              This dashboard evaluates the items you have added. It is an
              educational indication — not a legal assessment or guarantee of
              any outcome.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/evidence">
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Manage evidence
                </Button>
              </Link>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-40 lg:block"
          />

          <div className="flex justify-center lg:justify-end">
            <CaseReadinessMeter
              score={readiness.overallScore}
              tier={readiness.tier}
            />
          </div>
        </div>
      </div>

      {/* Coverage + Letters */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent className="p-7">
            <CategoryCoverage coverage={readiness.coverage} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-7">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              Recommendation letter readiness
            </div>
            <div className="mt-5 flex items-end gap-3">
              <span className="number-display text-4xl font-semibold text-foreground">
                {readiness.letterReadiness.count}
              </span>
              <span className="mb-1 text-sm text-muted-foreground">
                / {readiness.letterReadiness.target} target
              </span>
            </div>
            {readiness.letterReadiness.count > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Average letter score:{" "}
                <span className="font-medium text-foreground number-display">
                  {readiness.letterReadiness.avgScore}
                </span>
                /100
              </p>
            )}
            <div className="mt-5 rounded-xl border border-border/60 bg-background/60 p-4">
              <p
                className={cn(
                  "text-sm font-medium",
                  readiness.letterReadiness.ready
                    ? "text-success"
                    : "text-warning"
                )}
              >
                {readiness.letterReadiness.ready
                  ? "Letter sources appear adequate"
                  : "Letter coverage needs attention"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {readiness.letterReadiness.ready
                  ? "Three sources identified with adequate scores. Ensure letters are from senior, internationally recognised figures."
                  : readiness.letterReadiness.count < 3
                    ? "Three recommendation letters from senior figures are typically expected. Consider adding more sources."
                    : "Letter sources identified but average quality may benefit from stronger referees."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths + Risks */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionBlock
          icon={<TrendingUp className="h-4 w-4" />}
          tone="success"
          eyebrow="Top strengths"
          title="Areas that appear well-supported"
          empty="Add more evidence to surface strengths."
          items={readiness.strengths}
        />
        <SectionBlock
          icon={<AlertCircle className="h-4 w-4" />}
          tone="warning"
          eyebrow="Top risks"
          title="Areas that may need attention"
          empty="No significant risks surfaced yet."
          items={readiness.risks}
        />
      </div>

      {/* Next actions */}
      <Card>
        <CardContent className="p-7 sm:p-10">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-gold" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Suggested next actions
            </span>
          </div>
          <h2 className="editorial-heading mt-3 text-2xl text-foreground sm:text-3xl">
            What to focus on next.
          </h2>
          <ol className="mt-6 space-y-3">
            {readiness.nextActions.map((action, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-xl border border-border/60 bg-background/60 p-4"
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/8 text-xs font-semibold text-primary number-display">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {action}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Suggested Pack */}
      <Card>
        <CardContent className="p-7 sm:p-10">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Application dossier
            </span>
          </div>
          <h2 className="editorial-heading mt-3 text-2xl text-foreground sm:text-3xl">
            Suggested evidence selection.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Based on your strongest items, here is a suggested 10-piece pack.
            Gaps indicate where additional evidence may be needed.
          </p>
          <EvidencePack slots={readiness.suggestedPack} className="mt-7" />
        </CardContent>
      </Card>

      <DisclaimerBox variant="outlined">
        The Evidence Builder is an educational planning tool. It does not
        provide legal or immigration advice and cannot guarantee visa approval,
        endorsement, or eligibility. Scores are indicative only. Always consult
        a qualified immigration adviser before finalising your application.
      </DisclaimerBox>
    </div>
  );
}

function SectionBlock({
  eyebrow,
  title,
  items,
  icon,
  tone,
  empty,
}: {
  eyebrow: string;
  title: string;
  items: { title: string; description: string }[];
  icon: React.ReactNode;
  tone: "success" | "warning";
  empty: string;
}) {
  return (
    <Card>
      <CardContent className="p-7">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-wider",
            tone === "success" && "bg-success/10 text-success",
            tone === "warning" && "bg-warning/10 text-warning"
          )}
        >
          {icon}
          {eyebrow}
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {items.map((item, i) => (
              <li
                key={i}
                className="rounded-xl border border-border/60 bg-background/60 p-4"
              >
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
