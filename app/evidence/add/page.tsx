"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EvidenceForm } from "@/components/EvidenceForm";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import type { EvidenceItem } from "@/lib/evidence-types";

const STORAGE_KEY = "gtv-fit-check:evidence-items";

export default function AddEvidencePage() {
  const router = useRouter();

  const handleSubmit = (item: EvidenceItem) => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    let items: EvidenceItem[] = [];
    if (raw) {
      try {
        items = JSON.parse(raw);
      } catch {
        /* ignore */
      }
    }
    items.push(item);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    router.push("/evidence");
  };

  const handleCancel = () => {
    router.push("/evidence");
  };

  return (
    <section className="container max-w-3xl py-12 sm:py-20">
      <Link
        href="/evidence"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to evidence list
      </Link>

      <div className="mt-6">
        <Badge variant="muted">
          <span className="text-[10px] uppercase tracking-wider">
            Add evidence
          </span>
        </Badge>
        <h1 className="editorial-heading mt-4 text-balance text-3xl sm:text-4xl">
          Describe this piece of evidence.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Be as specific as you can. The more detail you provide, the more
          accurately the system can evaluate strength and risk.
        </p>
      </div>

      <div className="mt-8">
        <EvidenceForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>

      <DisclaimerBox className="mt-10" />
    </section>
  );
}
