import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container py-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold">
                GT
              </span>
              <span className="text-sm font-semibold tracking-tight">
                GTV Fit Check
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              Educational self-assessment for the UK Global Talent Visa.
              Independent and not affiliated with the UK government, the Home
              Office, or any endorsing body.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:items-end">
            <div className="flex gap-5">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link
                href="/assessment"
                className="hover:text-foreground transition-colors"
              >
                Routes
              </Link>
            </div>
            <p>© {new Date().getFullYear()} GTV Fit Check · Demo build</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
