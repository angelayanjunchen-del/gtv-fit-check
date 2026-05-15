import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold tracking-tight">
            GT
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              GTV Fit Check
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Self-assessment
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/assessment"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Assessment
          </Link>
          <Link
            href="/assessment/arts-culture"
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Arts & Culture
          </Link>
        </nav>
      </div>
    </header>
  );
}
