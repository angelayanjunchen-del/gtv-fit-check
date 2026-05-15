import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "GTV Fit Check — UK Global Talent Visa self-assessment",
  description:
    "A calm, intelligent self-assessment for artists, creative professionals, founders and researchers exploring the UK Global Talent Visa. Educational only.",
  metadataBase: new URL("https://gtv-fit-check.example.com"),
  openGraph: {
    title: "GTV Fit Check",
    description:
      "Self-assess your UK Global Talent Visa fit and plan your evidence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
