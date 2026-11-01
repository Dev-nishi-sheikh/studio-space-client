"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Aperture, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { StudioForm } from "@/components/studios/studio-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudio } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { buttonClass } from "@/lib/ui";

export function EditStudioClient({ id }: { id: string }) {
  const { user } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getStudio(id)
      .then((result) => {
        if (active) setStudio(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : "Couldn't load that listing.";
        setError(message);
        toast.error("Listing unavailable", { description: message });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
        <div className="space-y-5">
          <Skeleton className="h-64 w-full rounded-[1.5rem]" />
          <Skeleton className="h-40 w-full rounded-[1.5rem]" />
          <Skeleton className="h-64 w-full rounded-[1.5rem]" />
        </div>
        <Skeleton className="h-80 w-full rounded-[1.5rem]" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="We couldn't open that listing"
        description={error}
        actionLabel="Back to my listings"
        actionHref="/my-listings"
      />
    );
  }

  if (!studio) {
    return (
      <EmptyState
        icon={Aperture}
        title="That studio no longer exists"
        description="It may have been deleted from another session. Head back to your listings to check."
        actionLabel="My studio listings"
        actionHref="/my-listings"
      />
    );
  }

  if (user && studio.ownerEmail !== user.email) {
    return (
      <EmptyState
        icon={Aperture}
        title="This listing belongs to another host"
        description="You can only edit studios that were added with your own account. Here's everything on your account instead."
        actionLabel="My studio listings"
        actionHref="/my-listings"
        secondaryLabel="Browse studios"
        secondaryHref="/studios"
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-muted">
            Editing
          </p>
          <h2 className="font-display text-2xl font-semibold">{studio.title}</h2>
        </div>
        <Link
          href={`/studios/${studio._id}`}
          className={buttonClass({ variant: "outline", size: "sm" })}
        >
          View public page
        </Link>
      </div>
      <StudioForm mode="edit" studio={studio} />
    </div>
  );
}
