"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  BarChart3,
  Sparkles,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EvidenceItemCard } from "@/components/EvidenceItemCard";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { scoreEvidence } from "@/lib/evidence-scoring";
import { MOCK_EVIDENCE } from "@/lib/evidence-mock";
import type { EvidenceItem } from "@/lib/evidence-types";

const STORAGE_KEY = "gtv-fit-check:evidence-items";

function loadItems(): EvidenceItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as EvidenceItem[];
      return parsed.map((item) => ({
        ...item,
        status: item.status || "done",
      }));
    } catch {
      /* ignore */
    }
  }
  return [];
}

function saveItems(items: EvidenceItem[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export default function EvidenceListPage() {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setLoaded(true);
  }, []);

  const removeItem = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    saveItems(next);
  };

  const loadDemo = () => {
    setItems(MOCK_EVIDENCE);
    saveItems(MOCK_EVIDENCE);
  };

  const scored = items.map((item) => ({
    item,
    score: scoreEvidence(item),
  }));

  const doneCount = items.filter((i) => i.status === "done").length;
  const intentCount = items.filter((i) => i.status === "intent").length;
  const strongCount = scored.filter((s) => s.item.status === "done" && s.score.risk === "strong").length;
  const weakCount = scored.filter(
    (s) => s.item.status === "done" && (s.score.risk === "weak" || s.score.risk === "needs-review")
  ).length;

  if (!loaded) {
    return (
      <section className="container max-w-4xl py-20">
        <div className="h-10 w-60 animate-pulse rounded bg-muted" />
      </section>
    );
  }

  return (
    <section className="container max-w-4xl py-12 sm:py-20">
      <Link
        href="/result"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to assessment result
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="muted">
            <span className="text-[10px] uppercase tracking-wider">
              Evidence Builder
            </span>
          </Badge>
          <h1 className="editorial-heading mt-4 text-balance text-3xl sm:text-4xl">
            Build your evidence portfolio.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Add each piece of evidence individually. The system evaluates
            strength, completeness, and risk for every item.
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/evidence/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add evidence
          </Button>
        </Link>
        {items.length > 0 && (
          <Link href="/evidence/dashboard">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              View dashboard
            </Button>
          </Link>
        )}
        {items.length === 0 && (
          <Button
            variant="ghost"
            onClick={loadDemo}
            className="gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Load demo evidence
          </Button>
        )}
      </div>

      {/* Stats strip */}
      {items.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-4">
          <MiniStat icon={<Layers className="h-3.5 w-3.5" />} label="Have" value={doneCount} />
          {intentCount > 0 && (
            <MiniStat icon={<Layers className="h-3.5 w-3.5 text-gold" />} label="Intent" value={intentCount} />
          )}
          <MiniStat icon={<BarChart3 className="h-3.5 w-3.5 text-success" />} label="Strong" value={strongCount} />
          {weakCount > 0 && (
            <MiniStat icon={<BarChart3 className="h-3.5 w-3.5 text-destructive" />} label="Risky" value={weakCount} />
          )}
        </div>
      )}

      {/* Item list */}
      {items.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">
              No evidence items yet. Add your first piece of evidence or load
              the demo set to explore.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {scored.map(({ item, score }) => (
            <EvidenceItemCard
              key={item.id}
              item={item}
              score={score}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}

      <DisclaimerBox className="mt-10" />
    </section>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs">
      {icon}
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground number-display">{value}</span>
    </div>
  );
}
