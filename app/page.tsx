import Link from "next/link";
import {
  Compass,
  Layers,
  Target,
  FileText,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Package,
} from "lucide-react";
import { LandingHero } from "@/components/LandingHero";
import { FeatureCard } from "@/components/FeatureCard";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div>
      <LandingHero />

      {/* Features */}
      <section id="how-it-works" className="container max-w-6xl pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="muted" className="px-3">
            <span className="text-[10px] uppercase tracking-wider">
              How it works
            </span>
          </Badge>
          <h2 className="editorial-heading mt-5 text-balance text-3xl text-foreground sm:text-4xl">
            From scattered achievements to a professional evidence case.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Four stages. No legal jargon. No false promises.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            index={1}
            icon={Compass}
            title="Self-assess your route"
            description="Find out whether your background may align with Exceptional Talent or Exceptional Promise."
          />
          <FeatureCard
            index={2}
            icon={Layers}
            title="Build your evidence"
            description="Add each piece of evidence — exhibitions, press, awards, letters — and see its strength and risk."
          />
          <FeatureCard
            index={3}
            icon={BarChart3}
            title="Diagnose your case"
            description="See category coverage, recommender readiness, risk flags, and a case narrative."
          />
          <FeatureCard
            index={4}
            icon={Package}
            title="Plan your dossier"
            description="Get a suggested 10-piece evidence pack, gap report, and prioritised next actions."
          />
        </div>
      </section>

      {/* Editorial split */}
      <section className="bg-muted/40 py-20">
        <div className="container max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="muted">
                <span className="text-[10px] uppercase tracking-wider">
                  Evidence intelligence
                </span>
              </Badge>
              <h2 className="editorial-heading mt-5 text-balance text-3xl text-foreground sm:text-4xl">
                Not just a score. A material-level diagnosis.
              </h2>
              <p className="mt-5 text-balance text-muted-foreground">
                The hardest part of Global Talent isn&apos;t having achievements
                — it&apos;s knowing whether each piece of evidence is strong
                enough, documented correctly, and tells a coherent story. We
                help you evaluate that before anyone else does.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <ValueRow
                  icon={<Sparkles className="h-4 w-4 text-gold" />}
                  title="Per-item scoring"
                  copy="Each evidence item is scored across 5 dimensions: category fit, source authority, linkage, internationality, documentation."
                />
                <ValueRow
                  icon={<FileText className="h-4 w-4 text-primary" />}
                  title="Recommender evaluator"
                  copy="Check whether your letter sources are senior enough, UK-based, and properly credentialed."
                />
                <ValueRow
                  icon={<ShieldCheck className="h-4 w-4 text-success" />}
                  title="Risk flags"
                  copy="Spot weak evidence early — self-published sources, missing names, old dates, low authority."
                />
                <ValueRow
                  icon={<Target className="h-4 w-4 text-primary" />}
                  title="Actionable gap report"
                  copy="Know exactly what to add, replace, or strengthen — not just a number."
                />
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/evidence">
                  <CTAButton>Open Evidence Builder</CTAButton>
                </Link>
                <Link href="/assessment">
                  <CTAButton variant="outline" withArrow={false}>
                    Start with assessment
                  </CTAButton>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Card className="overflow-hidden">
                <CardContent className="space-y-4 p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="gold">Demo</Badge>
                      <span className="text-xs text-muted-foreground">
                        Evidence item preview
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Score
                    </span>
                  </div>

                  <div className="flex items-end gap-3">
                    <span className="number-display text-5xl font-semibold tracking-tight">
                      82
                    </span>
                    <span className="mb-2 text-sm text-muted-foreground">
                      / 100
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-success">Strong evidence</p>
                    <p className="text-muted-foreground">
                      Solo exhibition — Tate Modern Project Space
                    </p>
                  </div>

                  <div className="space-y-2">
                    <ScoreBar label="Category" value={16} max={20} />
                    <ScoreBar label="Source" value={25} max={25} />
                    <ScoreBar label="Linkage" value={20} max={20} />
                    <ScoreBar label="International" value={12} max={20} />
                    <ScoreBar label="Docs" value={15} max={15} />
                  </div>

                  <div className="rounded-xl border border-border/60 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Suggestion
                    </p>
                    <p className="mt-1 text-sm">
                      Consider adding an independent press review to further
                      strengthen this item.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-2xl bg-gold/12" />
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container max-w-3xl py-20">
        <div className="text-center">
          <Badge variant="muted">
            <span className="text-[10px] uppercase tracking-wider">
              Important
            </span>
          </Badge>
          <h2 className="editorial-heading mt-5 text-3xl text-foreground sm:text-4xl">
            Honesty first.
          </h2>
          <p className="mt-5 text-balance text-muted-foreground">
            We don&apos;t decide whether you&apos;ll be endorsed or approved.
            We help you evaluate the strength and completeness of your evidence
            before anyone else does.
          </p>
        </div>

        <DisclaimerBox className="mt-8" variant="outlined" />
      </section>
    </div>
  );
}

function ValueRow({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-card shadow-soft">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {copy}
        </p>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs text-muted-foreground text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-success transition-all"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="w-10 text-xs text-muted-foreground number-display text-right">
        {value}/{max}
      </span>
    </div>
  );
}
