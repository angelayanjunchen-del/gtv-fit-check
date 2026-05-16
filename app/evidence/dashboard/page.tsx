"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EvidenceDashboard } from "@/components/EvidenceDashboard";
import { buildCaseReadiness } from "@/lib/evidence-scoring";
import { MOCK_EVIDENCE } from "@/lib/evidence-mock";
import type { EvidenceItem } from "@/lib/evidence-types";
import type { CaseReadiness } from "@/lib/evidence-types";

const STORAGE_KEY = "gtv-fit-check:evidence-items";

export default function EvidenceDashboardPage() {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [readiness, setReadiness] = useState<CaseReadiness | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    let data: EvidenceItem[] = [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as EvidenceItem[];
        data = parsed.map((item) => ({ ...item, status: item.status || "done" }));
      } catch {
        /* ignore */
      }
    }
    setItems(data);
    if (data.length > 0) {
      setReadiness(buildCaseReadiness(data));
    }
    setLoaded(true);
  }, []);

  const loadDemo = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_EVIDENCE));
    setItems(MOCK_EVIDENCE);
    setReadiness(buildCaseReadiness(MOCK_EVIDENCE));
    setUsingDemo(true);
  };

  if (!loaded) {
    return (
      <section className="container max-w-5xl py-20">
        <Card>
          <CardContent className="p-10">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!readiness || items.length === 0) {
    return (
      <section className="container max-w-2xl py-20">
        <Card>
          <CardContent className="p-10">
            <Badge variant="muted">
              <span className="text-[10px] uppercase tracking-wider">
                No evidence yet
              </span>
            </Badge>
            <h1 className="editorial-heading mt-5 text-3xl">
              Add evidence items to see your dashboard.
            </h1>
            <p className="mt-4 text-muted-foreground">
              The dashboard analyses your evidence portfolio for coverage,
              strength and risk. Add items first, or preview with demo data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/evidence/add">
                <Button size="lg">Add evidence</Button>
              </Link>
              <Button
                onClick={loadDemo}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Sparkles className="h-4 w-4 text-gold" />
                Preview with demo data
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container max-w-5xl py-12 sm:py-16">
      <Link
        href="/evidence"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to evidence list
      </Link>

      {usingDemo && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-gold/30 bg-gold/8 px-4 py-3 text-xs text-foreground/80">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span>
            Viewing demo dashboard generated from sample evidence.
          </span>
          <Link
            href="/evidence/add"
            className="ml-auto font-medium text-primary hover:underline"
          >
            Add your own evidence →
          </Link>
        </div>
      )}

      <EvidenceDashboard readiness={readiness} totalItems={items.length} />
    </section>
  );
}
