import Link from "next/link";
import {
  Compass,
  Layers,
  Target,
  FileText,
  Sparkles,
  ShieldCheck,
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
            From scattered achievements to a clear application plan.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Three short steps. No legal jargon. No false promises.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <FeatureCard
            index={1}
            icon={Compass}
            title="Understand your possible GTV route"
            description="Find out whether your background may align with Exceptional Talent or Exceptional Promise."
          />
          <FeatureCard
            index={2}
            icon={Layers}
            title="Map your evidence"
            description="See which awards, exhibitions, residencies and press could support your application."
          />
          <FeatureCard
            index={3}
            icon={Target}
            title="Identify missing materials"
            description="Get a clear, prioritised list of what to prepare before speaking to an adviser."
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
                  Built for creative careers
                </span>
              </Badge>
              <h2 className="editorial-heading mt-5 text-balance text-3xl text-foreground sm:text-4xl">
                A self-assessment that respects how your career actually looks.
              </h2>
              <p className="mt-5 text-balance text-muted-foreground">
                Group shows, residencies, fellowships, commissions, screenings,
                press features — your work shows up in many places. We help you
                organise it before anyone else has to read it.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <ValueRow
                  icon={<Sparkles className="h-4 w-4 text-gold" />}
                  title="Built for artists & creators"
                  copy="Wording that respects creative practice — not corporate jargon."
                />
                <ValueRow
                  icon={<FileText className="h-4 w-4 text-primary" />}
                  title="Evidence-first"
                  copy="Designed around the materials endorsing bodies actually look for."
                />
                <ValueRow
                  icon={<ShieldCheck className="h-4 w-4 text-success" />}
                  title="Calm and honest"
                  copy="No false guarantees. Safer language. Realistic indicators."
                />
                <ValueRow
                  icon={<Target className="h-4 w-4 text-primary" />}
                  title="Actionable"
                  copy="Walk away with next steps, not just a score."
                />
              </div>

              <div className="mt-10">
                <Link href="/assessment">
                  <CTAButton>Start your self-assessment</CTAButton>
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
                        Sample result preview
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Score
                    </span>
                  </div>

                  <div className="flex items-end gap-3">
                    <span className="number-display text-5xl font-semibold tracking-tight">
                      72
                    </span>
                    <span className="mb-2 text-sm text-muted-foreground">
                      / 100
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Possible fit</p>
                    <p className="text-muted-foreground">
                      Your background <em>may be suitable</em> for the
                      potential Exceptional Promise route.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Top strength
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      International recognition
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Suggested next step
                    </p>
                    <p className="mt-1 text-sm">
                      Identify three senior, internationally known referees who
                      can speak to your work first-hand.
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
            We don&apos;t decide whether you&apos;ll be endorsed or approved. We help you
            think clearly about your evidence before anyone else does.
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
