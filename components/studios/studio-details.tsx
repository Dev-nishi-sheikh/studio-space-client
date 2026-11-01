"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Aperture,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  ImageIcon,
  MapPin,
  Share2,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { StudioCard } from "@/components/studio-card";
import { BookingModal } from "@/components/studios/booking-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/ui/star-rating";
import { getStudio, getStudios } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { getRatingBreakdown, getStudioReviews } from "@/lib/reviews";
import { badgeClass, buttonClass } from "@/lib/ui";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export function StudioDetails({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggle } = useWishlist();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [related, setRelated] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getStudio(id)
      .then((result) => {
        if (!active) return;
        setStudio(result);
        if (result) {
          getStudios({ category: result.category })
            .then((list) => {
              if (active) {
                setRelated(list.filter((item) => item._id !== result._id).slice(0, 3));
              }
            })
            .catch(() => {
              if (active) setRelated([]);
            });
        }
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : "Couldn't load that studio.";
        setError(message);
        toast.error("Studio unavailable", { description: message });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const gallery = useMemo(() => {
    if (!studio) return [];
    return Array.from(new Set([studio.image, ...studio.gallery])).slice(0, 4);
  }, [studio]);

  const reviews = useMemo(() => (studio ? getStudioReviews(studio) : []), [studio]);
  const breakdown = useMemo(() => (studio ? getRatingBreakdown(studio) : []), [studio]);
  const isOwner = Boolean(user && studio && user.email === studio.ownerEmail);
  const saved = studio ? isSaved(studio._id) : false;

  async function shareStudio() {
    if (!studio) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: studio.title, text: studio.overview, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: "Send it to whoever is holding the call sheet." });
    } catch {
      toast.info("Share this studio", { description: url });
    }
  }

  if (loading) return <StudioDetailsSkeleton />;

  if (error || !studio) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={Aperture}
          title="That room isn't on the map"
          description={
            error ??
            "The listing may have been taken down by its host. Try the directory — there are plenty of other rooms."
          }
          actionLabel="Explore studios"
          actionHref="/studios"
        />
      </div>
    );
  }

  const openLightbox = (index: number) => setLightboxIndex(index);
  const currentImage = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  return (
    <>
      <div className="container-x pb-16 pt-6 sm:pt-8">
        <nav className="flex items-center gap-2 text-[0.7rem] font-semibold text-muted">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/studios" className="hover:text-foreground">
            Studios
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{studio.title}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={badgeClass("accent")}>{studio.category}</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {studio.rating.toFixed(1)}
                <span className="font-medium text-muted">({studio.reviewCount} reviews)</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {studio.location}
              </span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[3.4rem]">
              {studio.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Up to {studio.capacity} people
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Hourly bookings from 1 hour
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                Host verified
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void toggle(studio._id)}
              className={buttonClass({
                variant: "outline",
                size: "sm",
                className: cn("gap-1.5", saved && "border-accent/40 text-accent"),
              })}
            >
              <Heart className={cn("h-4 w-4", saved && "fill-current")} />
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => void shareStudio()}
              className={buttonClass({ variant: "outline", size: "sm", className: "gap-1.5" })}
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        <div className="mt-7">
          <div className="relative hidden h-[430px] grid-cols-4 grid-rows-2 gap-2.5 overflow-hidden rounded-[1.5rem] md:grid">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => openLightbox(index)}
                aria-label={`View gallery image ${index + 1}`}
                className={cn(
                  "group relative overflow-hidden bg-surface-2 focus-visible:outline-offset-2",
                  index === 0 && "col-span-2 row-span-2",
                  index === 1 && "row-span-2",
                )}
              >
                <Image
                  src={image}
                  alt={`${studio.title} photo ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes={index === 0 ? "50vw" : "25vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
              </button>
            ))}
            {gallery.length > 0 && (
              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-xs font-bold text-white backdrop-blur-md hover:bg-black/70"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                View all photos
              </button>
            )}
          </div>

          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-1 md:hidden">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => openLightbox(index)}
                className="relative aspect-[4/3] w-[86vw] shrink-0 snap-center overflow-hidden rounded-xl bg-surface-2"
              >
                <Image
                  src={image}
                  alt={`${studio.title} photo ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="86vw"
                  className="object-cover"
                />
                <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.6rem] font-bold text-white backdrop-blur">
                  {index + 1} / {gallery.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          <div className="min-w-0">
            <section>
              <h2 className="font-display text-2xl font-semibold">The space</h2>
              <div className="mt-4 space-y-4 text-[0.92rem] leading-[1.8] text-muted">
                {studio.overview.split("\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Hourly rate", value: `${formatCurrency(studio.hourlyRate)} / hr` },
                  { label: "Security deposit", value: formatCurrency(studio.securityDeposit) },
                  { label: "Capacity", value: `${studio.capacity} people` },
                  { label: "Room type", value: studio.category },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-surface p-3.5">
                    <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-sm font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 border-t border-border pt-10">
              <h2 className="font-display text-2xl font-semibold">What&apos;s included</h2>
              <p className="mt-1.5 text-sm text-muted">
                Everything below is part of the room — no surprise add-ons.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {studio.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime/25 text-lime-foreground dark:text-lime">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 border-t border-border pt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold">What creators say</h2>
                  <p className="mt-1.5 text-sm text-muted">
                    Reviews from real bookings at this space.
                  </p>
                </div>
                <StarRating value={studio.rating} count={studio.reviewCount} size={16} />
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-10">
                  <div className="flex items-center gap-4 sm:block">
                    <p className="font-display text-5xl font-semibold leading-none">
                      {studio.rating.toFixed(1)}
                    </p>
                    <div className="sm:mt-2">
                      <StarRating value={studio.rating} showValue={false} size={15} />
                      <p className="mt-1 text-xs text-muted">{studio.reviewCount} reviews</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {breakdown.map((row) => {
                      const percent = Math.round((row.count / Math.max(studio.reviewCount, 1)) * 100);
                      return (
                        <div key={row.stars} className="flex items-center gap-3">
                          <span className="w-8 text-xs font-bold text-muted">{row.stars}★</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="h-full rounded-full bg-amber-400"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-[0.65rem] text-muted">{row.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <article key={review._id} className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex items-start gap-3">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-2">
                        <Image
                          src={review.avatar}
                          alt={review.author}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold">{review.author}</p>
                          <span className="text-[0.65rem] text-muted">
                            {formatDate(review.date)}
                          </span>
                        </div>
                        <StarRating value={review.rating} showValue={false} size={12} className="mt-1" />
                        <p className="mt-2 text-[0.83rem] leading-relaxed text-muted">{review.text}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-12 border-t border-border pt-10">
              <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-2">
                  {studio.ownerAvatar ? (
                    <Image
                      src={studio.ownerAvatar}
                      alt={studio.ownerName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center font-display text-xl">
                      {studio.ownerName[0]}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-muted">
                    Your host
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold">{studio.ownerName}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Verified host
                    </span>
                    <span>Usually replies within an hour</span>
                  </p>
                </div>
                <a
                  href={`mailto:${studio.ownerEmail}`}
                  className={buttonClass({ variant: "outline", size: "sm" })}
                >
                  Contact host
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.6)]">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <span className="font-display text-3xl font-semibold">
                    {formatCurrency(studio.hourlyRate)}
                  </span>
                  <span className="ml-1 text-xs font-medium text-muted">/ hour</span>
                </div>
                <div className="text-right text-[0.65rem] text-muted">
                  <p className="font-bold text-foreground">
                    {formatCurrency(studio.securityDeposit)} deposit
                  </p>
                  <p>refundable after shoot</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
                <div className="bg-background p-3">
                  <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                    Capacity
                  </p>
                  <p className="mt-1 text-xs font-bold">{studio.capacity} people</p>
                </div>
                <div className="bg-background p-3">
                  <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                    Minimum
                  </p>
                  <p className="mt-1 text-xs font-bold">1 hour</p>
                </div>
                <div className="bg-background p-3">
                  <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                    Cancellation
                  </p>
                  <p className="mt-1 text-xs font-bold">Free while pending</p>
                </div>
                <div className="bg-background p-3">
                  <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                    Response
                  </p>
                  <p className="mt-1 text-xs font-bold">Within 1 hour</p>
                </div>
              </div>

              {isOwner ? (
                <div className="mt-4 space-y-2">
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className={buttonClass({ size: "lg", className: "w-full" })}
                  >
                    Edit your listing
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/my-listings"
                    className={buttonClass({ variant: "outline", size: "md", className: "w-full" })}
                  >
                    Manage all listings
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      toast.error("Log in to book this space", {
                        description: "You'll come straight back to this studio.",
                      });
                      router.push(
                        `/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`,
                      );
                      return;
                    }
                    setBookingOpen(true);
                  }}
                  className={buttonClass({ size: "lg", className: "mt-4 w-full" })}
                >
                  <CalendarDays className="h-4 w-4" />
                  Book workspace now
                </button>
              )}

              <p className="mt-3 text-center text-[0.65rem] text-muted">
                You won&apos;t be charged until the host confirms.
              </p>

              <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-[0.68rem] leading-relaxed text-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                Covered by the StudioSpace host guarantee — liability protection, verified profiles
                and 24/7 support.
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-[0.68rem] text-muted">
              <BadgeCheck className="h-4 w-4 text-accent" />
              Host verified by the StudioSpace team
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-surface py-14">
          <div className="container-x">
            <SectionHeading
              eyebrow="Keep looking"
              title="More rooms like this"
              actionLabel="See all"
              actionHref={`/studios?category=${encodeURIComponent(studio.category)}`}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((item) => (
                <StudioCard key={item._id} studio={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BookingModal studio={studio} open={bookingOpen} onClose={() => setBookingOpen(false)} />

      <Modal
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        title="Studio gallery"
        description={`${studio.title} · ${studio.location}`}
        size="lg"
      >
        {currentImage && (
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-2">
              <Image
                src={currentImage}
                alt={`${studio.title} gallery`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setLightboxIndex((index) =>
                    index === null ? 0 : (index - 1 + gallery.length) % gallery.length,
                  )
                }
                className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() =>
                  setLightboxIndex((index) =>
                    index === null ? 0 : (index + 1) % gallery.length,
                  )
                }
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] font-bold text-white backdrop-blur">
                {(lightboxIndex ?? 0) + 1} / {gallery.length}
              </span>
            </div>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((image, index) => (
                <button
                  key={`thumb-${image}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className={cn(
                    "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity",
                    lightboxIndex === index
                      ? "border-accent"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <Image src={image} alt="" fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href="/studios"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to studios
              </Link>
              <button
                type="button"
                onClick={() => void toggle(studio._id)}
                className={buttonClass({ variant: "outline", size: "sm", className: "gap-1.5" })}
              >
                <Heart className={cn("h-4 w-4", saved && "fill-current text-accent")} />
                {saved ? "Saved" : "Save studio"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function StudioDetailsSkeleton() {
  return (
    <div className="container-x pb-16 pt-8">
      <Skeleton className="h-3 w-52" />
      <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:justify-between">
        <div className="w-full space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-14 w-full max-w-xl" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
      <Skeleton className="mt-8 h-[430px] w-full rounded-[1.5rem]" />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-[420px] w-full rounded-[1.5rem]" />
      </div>
    </div>
  );
}
