"use client";

import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface StepperStep {
  id: string;
  label: string;
}

interface AssessmentStepperProps {
  steps: StepperStep[];
  current: number; // 0-indexed
  className?: string;
}

export function AssessmentStepper({
  steps,
  current,
  className,
}: AssessmentStepperProps) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="uppercase tracking-wider">
          Step {current + 1} of {steps.length}
        </span>
        <span className="font-medium text-foreground number-display">
          {Math.round(progress)}%
        </span>
      </div>

      <Progress value={progress} className="mt-3 h-1.5" />

      <ol className="mt-5 hidden gap-2 sm:flex">
        {steps.map((step, i) => {
          const state =
            i < current ? "done" : i === current ? "active" : "upcoming";
          return (
            <li
              key={step.id}
              className={cn(
                "flex flex-1 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                state === "done" &&
                  "border-primary/15 bg-primary/5 text-primary",
                state === "active" &&
                  "border-primary bg-primary text-primary-foreground",
                state === "upcoming" &&
                  "border-border bg-transparent text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold",
                  state === "done" && "bg-primary text-primary-foreground",
                  state === "active" && "bg-primary-foreground text-primary",
                  state === "upcoming" && "bg-muted text-muted-foreground"
                )}
              >
                {state === "done" ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </span>
              <span className="truncate font-medium">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
