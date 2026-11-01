"use client";

import Link from "next/link";
import { Aperture, RotateCcw } from "lucide-react";
import { buttonClass } from "@/lib/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full border border-border bg-surface text-accent">
        <Aperture className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <p className="eyebrow mt-6">Cut to black</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-[-0.04em]">
        Something interrupted the take.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        {error.message
          ? error.message
          : "We hit an unexpected error while loading this page. Try the take again — most of the time it lands on the second run."}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className={buttonClass({ size: "md" })}>
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
        <Link href="/" className={buttonClass({ variant: "outline", size: "md" })}>
          Return home
        </Link>
      </div>
    </div>
  );
}
