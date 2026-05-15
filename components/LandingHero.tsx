import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CTAButton } from "./CTAButton";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[640px] bg-grain" />
      <div className="container max-w-5xl pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="flex flex-col items-center text-center">
          <Badge variant="muted" className="gap-1.5 px-3 py-1">
            <Sparkles className="h-3 w-3 text-gold" />
            <span className="tracking-wide uppercase text-[10px] font-medium">
              UK Global Talent Visa · Arts &amp; Culture
            </span>
          </Badge>

          <h1 className="editorial-heading mt-8 text-balance text-4xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
            Assess your fit.
            <br />
            <span className="italic text-primary/85">
              Build a stronger evidence case.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            A guided tool for artists and creative professionals to map
            achievements, evaluate each piece of evidence for strength and
            risk, identify gaps, and prepare a clearer Arts &amp; Culture
            endorsement case.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/assessment">
              <CTAButton>Start your assessment</CTAButton>
            </Link>
            <Link href="/evidence">
              <CTAButton variant="outline" withArrow={false}>
                Open Evidence Builder
              </CTAButton>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No sign-up required · Free demo · Educational only · Not legal advice
          </p>
        </div>
      </div>
    </section>
  );
}
