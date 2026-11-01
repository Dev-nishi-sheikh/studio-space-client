"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Clock,
  Heart,
  LayoutDashboard,
  Plus,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { getMyBookings, getMyListings } from "@/lib/api";
import type { Booking, Studio } from "@/lib/types";
import { buttonClass } from "@/lib/ui";
import { formatCurrency, formatDate, formatTime, todayISO } from "@/lib/utils";

const quickActions = [
  {
    label: "Add a new studio",
    description: "Publish a room in ten minutes",
    href: "/add-studio",
    icon: Plus,
  },
  {
    label: "Manage listings",
    description: "Photos, pricing and details",
    href: "/my-listings",
    icon: Building2,
  },
  {
    label: "My bookings",
    description: "Requests, confirmed shoots, invoices",
    href: "/my-bookings",
    icon: CalendarDays,
  },
  {
    label: "Explore studios",
    description: "Find a room for the next shoot",
    href: "/studios",
    icon: Search,
  },
];

export function DashboardClient() {
  const { user } = useAuth();
  const { ids: wishlistIds } = useWishlist();
  const [listings, setListings] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    Promise.all([getMyListings(user.email), getMyBookings(user.email)])
      .then(([listingResult, bookingResult]) => {
        if (!active) return;
        setListings(listingResult);
        setBookings(bookingResult);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setFailed(true);
        toast.error("Dashboard data didn't load", {
          description: reason instanceof Error ? reason.message : "Please refresh and try again.",
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return null;

  const upcoming = bookings
    .filter(
      (booking) =>
        (booking.status === "Pending" || booking.status === "Confirmed") &&
        booking.date >= todayISO(),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const pending = bookings.filter((booking) => booking.status === "Pending").length;
  const spent = bookings
    .filter((booking) => booking.status === "Completed")
    .reduce((total, booking) => total + booking.total, 0);
  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center font-display text-lg">
                {user.name[0]}
              </span>
            )}
          </span>
          <div>
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-muted">
              Your workspace
            </p>
            <h2 className="font-display text-2xl font-semibold">Welcome back, {firstName}.</h2>
          </div>
        </div>
        <Link href="/add-studio" className={buttonClass({ size: "md" })}>
          <Plus className="h-4 w-4" />
          Add new studio
        </Link>
      </div>

      {failed && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
          <TriangleAlert className="h-4 w-4" />
          Some dashboard data couldn&apos;t load. The sections below may be incomplete.
        </div>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[7.5rem] w-full rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={Building2}
              label="Active listings"
              value={String(listings.length)}
              hint={listings.length ? "Live in the directory" : "No rooms published yet"}
              href="/my-listings"
            />
            <StatCard
              icon={CalendarDays}
              label="Upcoming shoots"
              value={String(upcoming.length)}
              hint="Pending + confirmed"
              href="/my-bookings"
            />
            <StatCard
              icon={Clock}
              label="Awaiting confirmation"
              value={String(pending)}
              hint="Hosts will respond soon"
              href="/my-bookings"
            />
            <StatCard
              icon={Heart}
              label="Saved spaces"
              value={String(wishlistIds.length)}
              hint="Your shortlist"
              href="/wishlist"
            />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Call sheet</p>
              <h3 className="mt-2 font-display text-xl font-semibold">Next up</h3>
            </div>
            <Link href="/my-bookings" className="text-link text-xs">
              All bookings
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[5.5rem] w-full rounded-xl" />
              ))}

            {!loading && upcoming.length === 0 && (
              <div className="rounded-xl border border-dashed border-border px-5 py-9 text-center">
                <CalendarDays className="mx-auto h-6 w-6 text-muted" />
                <p className="mt-3 text-sm font-bold">Nothing booked yet</p>
                <p className="mt-1 text-xs text-muted">
                  The calendar is wide open. Find a room and send your first request.
                </p>
                <Link
                  href="/studios"
                  className={buttonClass({ variant: "outline", size: "sm", className: "mt-4" })}
                >
                  Explore studios
                </Link>
              </div>
            )}

            {!loading &&
              upcoming.slice(0, 3).map((booking) => (
                <Link
                  key={booking._id}
                  href={`/studios/${booking.studioId}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-foreground/25"
                >
                  <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                    <Image
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{booking.studioTitle}</p>
                    <p className="mt-0.5 text-[0.68rem] text-muted">
                      {formatDate(booking.date, "weekday")} · {formatTime(booking.startTime)} –{" "}
                      {formatTime(booking.endTime)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} className="shrink-0 px-2 py-0.5" />
                </Link>
              ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="surface-card p-5">
            <p className="eyebrow">Quick actions</p>
            <div className="mt-4 grid gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition-colors hover:border-border hover:bg-background"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent">
                    <action.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold">{action.label}</span>
                    <span className="block truncate text-[0.65rem] text-muted">
                      {action.description}
                    </span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground p-5 text-background">
            <Sparkles className="absolute -right-2 -top-2 h-20 w-20 text-background/10" />
            <p className="relative text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-background/50">
              Completed spend
            </p>
            <p className="relative mt-2 font-display text-3xl font-semibold">
              {formatCurrency(spent)}
            </p>
            <p className="relative mt-1 text-[0.68rem] text-background/50">
              Across {bookings.filter((booking) => booking.status === "Completed").length} finished
              bookings.
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Host tools</p>
            <h3 className="mt-2 font-display text-xl font-semibold">Your spaces</h3>
          </div>
          <Link href="/my-listings" className="text-link text-xs">
            Manage all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4">
          {loading && <Skeleton className="h-32 w-full rounded-2xl" />}

          {!loading && listings.length === 0 && (
            <EmptyState
              icon={Building2}
              title="No listings yet"
              description="Have a room with good light or a quiet corner? List it on StudioSpace and start taking bookings."
              actionLabel="Create your first listing"
              actionHref="/add-studio"
              secondaryLabel="How hosting works"
              secondaryHref="/how-it-works"
            />
          )}

          {!loading && listings.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {listings.slice(0, 3).map((studio) => (
                <Link
                  key={studio._id}
                  href={`/studios/${studio._id}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <div className="relative aspect-[16/10] bg-surface-2">
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-bold">{studio.title}</p>
                    <p className="mt-1 flex items-center justify-between text-[0.68rem] text-muted">
                      <span>{studio.location}</span>
                      <span className="font-bold text-foreground">
                        {formatCurrency(studio.hourlyRate)}/hr
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  href,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  value: string;
  hint: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-foreground/25 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold leading-none">{value}</p>
      <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted">{label}</p>
      <p className="mt-1 text-[0.65rem] text-muted">{hint}</p>
    </Link>
  );
}
