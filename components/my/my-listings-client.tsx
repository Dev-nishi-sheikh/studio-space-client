"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Eye,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { IMAGES } from "@/lib/images";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteStudio, getMyListings } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { badgeClass, buttonClass } from "@/lib/ui";
import { formatCurrency } from "@/lib/utils";

export function MyListingsClient() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    getMyListings(user.email)
      .then((result) => {
        if (active) setStudios(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : "Couldn't load your listings.";
        setError(message);
        toast.error("Listings didn't load", { description: message });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  async function confirmDelete() {
    if (!target || !user) return;
    setDeleting(true);
    try {
      await deleteStudio(target._id, user);
      setStudios((current) => current.filter((studio) => studio._id !== target._id));
      toast.success("Listing deleted", {
        description: `${target.title} has been removed from the directory.`,
      });
      setTarget(null);
    } catch (reason) {
      toast.error("Couldn't delete the listing", {
        description: reason instanceof Error ? reason.message : "Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  }

  if (!user) return null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {loading
              ? "Gathering your spaces…"
              : `${studios.length} ${studios.length === 1 ? "space" : "spaces"} on your account`}
          </p>
          <p className="mt-1 text-xs text-muted">
            Signed in as <span className="font-bold text-foreground">{user.email}</span>
          </p>
        </div>
        <Link href="/add-studio" className={buttonClass({ size: "md" })}>
          <Plus className="h-4 w-4" />
          Add new studio
        </Link>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-[1.5rem] border border-border bg-surface p-4">
                <Skeleton className="aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="mt-4 h-6 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/2" />
                <Skeleton className="mt-4 h-10 w-full rounded-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <EmptyState
            icon={TriangleAlert}
            title="We couldn't reach your listings"
            description={error}
            actionLabel="Reload page"
            onAction={() => window.location.reload()}
          />
        )}

        {!loading && !error && studios.length === 0 && (
          <EmptyState
            icon={Building2}
            title="No spaces on your account yet"
            description="Turn that spare room, stage or studio into a listing. It takes about ten minutes and you set the rate."
            actionLabel="List your first studio"
            actionHref="/add-studio"
            secondaryLabel="See how hosting works"
            secondaryHref="/how-it-works"
          />
        )}

        {!loading && !error && studios.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-[1.5rem] border border-border bg-surface"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                  <Image
                    src={studio.image?.trim() || IMAGES.loft}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Live
                  </span>
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[0.65rem] font-bold text-white backdrop-blur">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {studio.rating.toFixed(1)}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={badgeClass("neutral", "mb-2")}>{studio.category}</p>
                      <h2 className="font-display text-xl font-semibold leading-snug">
                        {studio.title}
                      </h2>
                    </div>
                    <p className="shrink-0 text-right font-display text-lg font-semibold">
                      {formatCurrency(studio.hourlyRate)}
                      <span className="ml-0.5 text-[0.62rem] font-medium text-muted">/hr</span>
                    </p>
                  </div>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    {studio.location}
                  </p>

                  <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-[0.7rem] text-muted">
                    <span>{studio.capacity} guests</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{studio.reviewCount} reviews</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{studio.amenities.length} amenities</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/studios/${studio._id}`}
                      className={buttonClass({ variant: "outline", size: "sm", className: "px-2" })}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className={buttonClass({ variant: "soft", size: "sm", className: "px-2" })}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setTarget(studio)}
                      className={buttonClass({
                        variant: "outline",
                        size: "sm",
                        className: "border-red-500/30 px-2 text-red-500 hover:bg-red-500/10",
                      })}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(target)}
        onClose={() => {
          if (!deleting) setTarget(null);
        }}
        title="Delete this listing?"
        description="This removes the studio from the public directory immediately."
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setTarget(null)}
              disabled={deleting}
              className={buttonClass({ variant: "outline", size: "md" })}
            >
              Keep listing
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete()}
              disabled={deleting}
              className={buttonClass({ variant: "danger", size: "md" })}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {deleting ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/8 p-4">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="text-xs leading-relaxed text-muted">
            <p className="font-bold text-foreground">{target?.title}</p>
            <p className="mt-1">
              Existing bookings and saved wishlist entries for this space will also be removed. This
              action cannot be undone.
            </p>
          </div>
        </div>
        {target && (
          <Link
            href={`/studios/${target._id}`}
            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-foreground"
          >
            View the public page first
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </Modal>
    </div>
  );
}
