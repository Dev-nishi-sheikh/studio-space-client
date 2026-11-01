"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { getFeaturedStudios } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { StudioCard } from "@/components/studio-card";
import { StudioGridSkeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonClass } from "@/lib/ui";

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getFeaturedStudios(6)
      .then((result) => {
        if (active) setStudios(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Couldn't load studios.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="container-x py-16 sm:py-24">
      <SectionHeading
        eyebrow="Selected this week"
        title={
          <>
            Six spaces our
            <br className="hidden sm:block" /> community keeps booking.
          </>
        }
        description="Top-rated rooms across the city, picked by the people who actually shoot, record and make in them."
        actionLabel="Explore all studios"
        actionHref="/studios"
      />

      <div className="mt-10">
        {loading && <StudioGridSkeleton count={6} />}

        {!loading && error && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
            <AlertTriangle className="h-7 w-7 text-accent" />
            <div>
              <p className="font-display text-xl font-semibold">The listings didn&apos;t load.</p>
              <p className="mt-1 max-w-md text-sm text-muted">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={buttonClass({ variant: "outline", size: "sm" })}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link href="/studios" className={buttonClass({ variant: "outline", size: "md" })}>
          Explore all studios
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
