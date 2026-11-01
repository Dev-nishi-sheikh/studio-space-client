"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, MapPin, Star, Users } from "lucide-react";
import { useWishlist } from "@/components/wishlist-provider";
import type { Studio } from "@/lib/types";
import { badgeClass, buttonClass } from "@/lib/ui";
import { cn, formatCurrency } from "@/lib/utils";

export function StudioCard({
  studio,
  className,
  priority = false,
}: {
  studio: Studio;
  className?: string;
  priority?: boolean;
}) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(studio._id);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_24px_60px_-36px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <Link href={`/studios/${studio._id}`} aria-label={studio.title} className="block h-full">
          <Image
            src={studio.image}
            alt={studio.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-80" />
        </Link>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
          {studio.category}
        </span>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            void toggle(studio._id);
          }}
          aria-label={saved ? `Remove ${studio.title} from wishlist` : `Save ${studio.title} to wishlist`}
          aria-pressed={saved}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60",
            saved && "border-accent/40 bg-accent text-accent-foreground",
          )}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-current")} />
        </button>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[0.65rem] font-semibold text-white/90 backdrop-blur-md">
            <MapPin className="h-3 w-3 shrink-0 text-lime" />
            <span className="truncate">{studio.location}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[0.68rem] font-extrabold text-white backdrop-blur-md">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {studio.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.12rem] font-semibold leading-snug tracking-[-0.025em]">
            <Link href={`/studios/${studio._id}`} className="line-clamp-2 hover:text-accent">
              {studio.title}
            </Link>
          </h3>
          <span className={badgeClass("neutral", "shrink-0 px-2 py-0.5 text-[0.58rem]")}>
            {studio.reviewCount} reviews
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-2 text-[0.7rem] font-medium text-muted">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Up to {studio.capacity}
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="truncate">{studio.amenities[0] ?? "Flexible layout"}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4">
          <div className="leading-none">
            <span className="font-display text-xl font-semibold">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="ml-1 text-[0.68rem] font-medium text-muted">/ hr</span>
          </div>
          <Link
            href={`/studios/${studio._id}`}
            className={buttonClass({ variant: "outline", size: "sm", className: "gap-1.5" })}
          >
            View details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
