import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container max-w-xl py-24 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="editorial-heading mt-3 text-4xl">Page not found.</h1>
      <p className="mt-4 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    </section>
  );
}
