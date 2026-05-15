"use client";

import { ArrowRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTAButtonProps extends ButtonProps {
  withArrow?: boolean;
}

export function CTAButton({
  className,
  withArrow = true,
  children,
  ...props
}: CTAButtonProps) {
  return (
    <Button
      size="lg"
      className={cn("group", className)}
      {...props}
    >
      <span>{children}</span>
      {withArrow ? (
        <ArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
      ) : null}
    </Button>
  );
}
