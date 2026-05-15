"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { ResultDashboard } from "@/components/ResultDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_ASSESSMENT, runScoring } from "@/lib/scoring";
import type { AssessmentResult } from "@/lib/types";

type Stored = {
  result: AssessmentResult;
  at: number;
};

export default function ResultPage() {
  const [data, setData] = useState<Stored | null>(null);
  const [usingDemo, setUsingDemo] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("gtv-fit-check:last-result");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Stored;
        setData(parsed);
      } catch {
        /* ignore */
      }
    }
    setLoaded(true);
  }, []);

  const onUseDemo = () => {
    const result = runScoring(DEMO_ASSESSMENT);
    setData({ result, at: Date.now() });
    setUsingDemo(true);
  };

  const onDownload = () => {
    if (!data) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            generatedAt: new Date(data.at).toISOString(),
            note: "GTV Fit Check — demo report (educational only)",
            result: data.result,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gtv-fit-check-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!loaded) {
    return (
      <section className="container max-w-3xl py-20">
        <Card>
          <CardContent className="p-10">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="container max-w-2xl py-20">
        <Card>
          <CardContent className="p-10">
            <Badge variant="muted">
              <span className="text-[10px] uppercase tracking-wider">
                No result yet
              </span>
            </Badge>
            <h1 className="editorial-heading mt-5 text-3xl">
              You haven&apos;t completed an assessment in this browser.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Start the Arts & Culture self-assessment to generate a result, or
              preview a demo result with sample answers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/assessment/arts-culture">
                <Button size="lg">Start self-assessment</Button>
              </Link>
              <Button
                onClick={onUseDemo}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Sparkles className="h-4 w-4 text-gold" />
                Preview demo result
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container max-w-5xl py-12 sm:py-16">
      {usingDemo ? (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-gold/30 bg-gold/8 px-4 py-3 text-xs text-foreground/80">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span>
            You are viewing a demo result generated from sample answers.
          </span>
          <Link
            href="/assessment/arts-culture"
            className="ml-auto font-medium text-primary hover:underline"
          >
            Take the real assessment →
          </Link>
        </div>
      ) : null}
      <ResultDashboard result={data.result} onDownload={onDownload} />
    </section>
  );
}
