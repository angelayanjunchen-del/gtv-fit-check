"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Lightbulb,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScoreMeter } from "./ScoreMeter";
import { EvidenceChecklist } from "./EvidenceChecklist";
import { DisclaimerBox } from "./DisclaimerBox";
import { cn } from "@/lib/utils";
import type { AssessmentResult, RouteSuggestion } from "@/lib/types";

const ROUTE_LABEL: Record<RouteSuggestion, string> = {
  "exceptional-talent": "Potential Exceptional Talent route",
  "exceptional-promise": "Potential Exceptional Promise route",
  unclear: "Route fit unclear",
};

const ROUTE_DESCRIPTION: Record<RouteSuggestion, string> = {
  "exceptional-talent":
    "Designed for those already recognised as leaders in their field, with significant international standing.",
  "exceptional-promise":
    "Designed for emerging talent with strong achievements and a clear trajectory toward recognition.",
  unclear:
    "Your profile may not yet align clearly with either sub-route. Consider strengthening evidence first.",
};

interface ResultDashboardProps {
  result: AssessmentResult;
  onDownload?: () => void;
}

export function ResultDashboard({ result, onDownload }: ResultDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Top hero card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="absolute inset-0 -z-0 bg-grain opacity-80" />
        <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="muted" className="gap-1.5 px-2.5">
                <Sparkles className="h-3 w-3 text-gold" />
                <span className="text-[10px] uppercase tracking-wider">
                  Demo result
                </span>
              </Badge>
            </div>

            <h1 className="editorial-heading mt-6 text-balance text-4xl leading-tight sm:text-5xl">
              Your background <span className="italic">may be suitable</span>{" "}
              for the {ROUTE_LABEL[result.routeSuggestion].toLowerCase()}.
            </h1>

            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
              {ROUTE_DESCRIPTION[result.routeSuggestion]} This indication is
              educational and based on the answers you provided.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                variant="default"
                onClick={onDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download report
              </Button>
              <Link href="/assessment/arts-culture">
                <Button variant="outline">Edit answers</Button>
              </Link>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-40 lg:block"
          />

          <div className="flex justify-center lg:justify-end">
            <ScoreMeter score={result.score} tier={result.tier} />
          </div>
        </div>
      </div>

      {/* Evidence Builder CTA */}
      <Card className="overflow-hidden border-primary/20 bg-primary/[0.03]">
        <CardContent className="flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                Ready to build your evidence portfolio?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your evidence items one by one. The Evidence Builder scores
                each piece for strength, completeness and risk.
              </p>
            </div>
          </div>
          <Link href="/evidence" className="flex-shrink-0">
            <Button className="gap-2">
              Open Evidence Builder
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Strengths + Gaps */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionBlock
          icon={<TrendingUp className="h-4 w-4" />}
          tone="success"
          eyebrow="Strengths"
          title="Areas that may support your case"
          empty="We didn&apos;t identify clear strengths yet — keep building."
          items={result.strengths}
        />
        <SectionBlock
          icon={<AlertCircle className="h-4 w-4" />}
          tone="warning"
          eyebrow="Gaps"
          title="Areas that may need strengthening"
          empty="No major gaps surfaced from your answers."
          items={result.gaps}
        />
      </div>

      {/* Next steps */}
      <Card>
        <CardContent className="p-7 sm:p-10">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-gold" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Suggested next steps
            </span>
          </div>
          <h2 className="editorial-heading mt-3 text-2xl text-foreground sm:text-3xl">
            Consider preparing the following.
          </h2>
          <ol className="mt-6 space-y-3">
            {result.nextSteps.map((step, i) => (
              <li
                key={i}
                className="group flex items-start gap-4 rounded-xl border border-border/60 bg-background/60 p-4 transition-colors hover:bg-secondary/40"
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/8 text-xs font-semibold text-primary number-display">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardContent className="p-7 sm:p-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Document checklist
                </span>
              </div>
              <h2 className="editorial-heading mt-3 text-2xl text-foreground sm:text-3xl">
                What a strong dossier typically contains.
              </h2>
            </div>
          </div>
          <EvidenceChecklist items={result.checklist} className="mt-7" />
        </CardContent>
      </Card>

      <DisclaimerBox variant="outlined">
        GTV Fit Check is an educational self-assessment tool. It does not
        provide legal or immigration advice and cannot guarantee visa approval,
        endorsement, or eligibility. The Global Talent Visa is endorsed by
        independent bodies and decided by UK Visas and Immigration. Always
        consult a qualified immigration adviser before applying.
      </DisclaimerBox>

      <div className="flex justify-between pt-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
        <Link href="/assessment">
          <Button variant="outline" className="gap-2">
            Try another route
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface SectionBlockProps {
  eyebrow: string;
  title: string;
  items: { title: string; description: string }[];
  icon: React.ReactNode;
  tone: "success" | "warning";
  empty: string;
}

function SectionBlock({
  eyebrow,
  title,
  items,
  icon,
  tone,
  empty,
}: SectionBlockProps) {
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
