"use client";

import Link from "next/link";
import {
  Palette,
  Cpu,
  GraduationCap,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Route = {
  id: "arts-culture" | "digital-technology" | "research-academia";
  title: string;
  description: string;
  icon: typeof Palette;
  examples: string;
  available: boolean;
  accent: "navy" | "gold" | "green";
};

const ROUTES: Route[] = [
  {
    id: "arts-culture",
    title: "Arts & Culture",
    description:
      "For practising artists across visual arts, music, film, theatre, fashion, literature and combined arts.",
    icon: Palette,
    examples:
      "Painters, choreographers, musicians, filmmakers, writers, fashion designers",
    available: true,
    accent: "navy",
  },
  {
    id: "digital-technology",
    title: "Digital Technology",
    description:
      "For engineers, technical leaders, founders and product builders shaping digital industries.",
    icon: Cpu,
    examples: "Engineers, founders, product leaders, AI researchers",
    available: false,
    accent: "gold",
  },
  {
    id: "research-academia",
    title: "Research & Academia",
    description:
      "For researchers and academic leaders working at the frontier of their discipline.",
    icon: GraduationCap,
    examples: "Postdocs, principal investigators, group leaders",
    available: false,
    accent: "green",
  },
];

export function RouteSelector() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ROUTES.map((route) => {
        const Icon = route.icon;
        const card = (
          <Card
            className={cn(
              "group relative h-full overflow-hidden transition-all duration-300",
              route.available
                ? "hover:-translate-y-0.5 hover:shadow-elevated cursor-pointer"
                : "opacity-90"
            )}
          >
            <CardContent className="flex h-full flex-col p-7">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                    route.accent === "navy" &&
                      "bg-primary/8 text-primary group-hover:bg-primary/12",
                    route.accent === "gold" && "bg-gold/15 text-gold",
                    route.accent === "green" &&
                      "bg-success/12 text-success"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </div>
                {route.available ? (
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {route.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {route.description}
              </p>

              <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground/80">
                Typical applicants
              </p>
              <p className="mt-1 text-sm text-foreground/85">
                {route.examples}
              </p>

              <div className="mt-auto pt-7">
                {route.available ? (
                  <Badge variant="gold" className="px-2.5">
                    Available now
                  </Badge>
                ) : (
                  <Badge variant="muted" className="px-2.5">
                    Coming soon
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );

        return route.available ? (
          <Link key={route.id} href={`/assessment/${route.id}`}>
            {card}
          </Link>
        ) : (
          <div key={route.id}>{card}</div>
        );
      })}
    </div>
  );
}
