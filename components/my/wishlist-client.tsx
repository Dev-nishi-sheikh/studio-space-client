"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { StudioCard } from "@/components/studio-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StudioGridSkeleton } from "@/components/ui/skeleton";
import { getStudios } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { buttonClass } from "@/lib/ui";

export function WishlistClient() {
  const { user } = useAuth();
  const { ids, loading: wishlistLoading } = useWishlist();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getStudios()
      .then((result) => {
        if (active) setStudios(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : "Couldn't load saved studios.";
        setError(message);
        toast.error("Saved spaces didn't load", { description: message });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!user) return null;

  const saved = studios.filter((studio) => ids.includes(studio._id));
  const busy = loading || wishlistLoading;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
              Opening your shortlist…
            </span>
          ) : (
            <>
              <span className="font-bold text-foreground">{saved.length}</span>{" "}
              {saved.length === 1 ? "space" : "spaces"} saved by {user.name.split(" ")[0]}
            </>
          )}
        </p>
        <Link href="/studios" className={buttonClass({ variant: "outline", size: "sm" })}>
          Find more spaces
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6">
        {busy && <StudioGridSkeleton count={3} />}

        {!busy && error && (
          <EmptyState
            icon={TriangleAlert}
            title="Your shortlist didn't load"
            description={error}
            actionLabel="Reload page"
            onAction={() => window.location.reload()}
          />
        )}

        {!busy && !error && saved.length === 0 && (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any studio card to keep it here. Your shortlist is private and syncs across your account."
            actionLabel="Explore studios"
            actionHref="/studios"
          />
        )}

        {!busy && !error && saved.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {saved.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>

      {!busy && !error && saved.length > 0 && (
        <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-dashed border-border px-4 py-3 text-xs text-muted">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          Tap a filled heart to remove a space from your shortlist. Your list stays private to your
          account.
        </div>
      )}
    </div>
  );
}
