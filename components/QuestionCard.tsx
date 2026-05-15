"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface QuestionCardProps {
  label: string;
  hint?: string;
  options: Option[];
  value: string | null;
  onChange: (val: string) => void;
  name: string;
  layout?: "stack" | "grid";
  className?: string;
}

export function QuestionCard({
  label,
  hint,
  options,
  value,
  onChange,
  name,
  layout = "stack",
  className,
}: QuestionCardProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="mb-3">
        <Label className="text-base font-medium text-foreground">
          {label}
        </Label>
        {hint ? (
          <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      <RadioGroup
        value={value ?? ""}
        onValueChange={onChange}
        name={name}
        className={cn(
          layout === "grid"
            ? "grid grid-cols-2 gap-2 sm:grid-cols-4"
            : "flex flex-col gap-2"
        )}
      >
        {options.map((opt) => {
          const id = `${name}-${opt.value}`;
          const selected = value === opt.value;
          return (
            <Label
              key={opt.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                "hover:border-primary/40 hover:bg-secondary/40",
                selected
                  ? "border-primary bg-primary/[0.04] shadow-soft"
                  : "border-border bg-card"
              )}
            >
              <RadioGroupItem
                id={id}
                value={opt.value}
                className="mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="text-sm font-medium leading-tight text-foreground">
                  {opt.label}
                </div>
                {opt.description ? (
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {opt.description}
                  </div>
                ) : null}
              </div>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
