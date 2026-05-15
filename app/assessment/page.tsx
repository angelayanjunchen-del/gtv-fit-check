import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteSelector } from "@/components/RouteSelector";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export default function AssessmentLandingPage() {
  return (
    <section className="container max-w-5xl py-16 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="mt-8 max-w-2xl">
        <Badge variant="muted">
          <span className="text-[10px] uppercase tracking-wider">
            Step 1 of 2
          </span>
        </Badge>
        <h1 className="editorial-heading mt-5 text-balance text-4xl sm:text-5xl">
          Which route fits your work best?
        </h1>
        <p className="mt-5 text-balance text-muted-foreground">
          Choose the area closest to your professional practice. For this demo,
          only the <span className="text-foreground">Arts & Culture</span>{" "}
          assessment is interactive — the other routes are coming soon.
        </p>
      </div>

      <div className="mt-12">
        <RouteSelector />
      </div>

      <div className="mt-14 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <DisclaimerBox className="mt-10" />
    </section>
  );
}
