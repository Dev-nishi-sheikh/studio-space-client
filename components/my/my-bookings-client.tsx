"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  FileText,
  Loader2,
  TriangleAlert,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { ListRowSkeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { cancelBooking, getMyBookings } from "@/lib/api";
import type { Booking, BookingStatus } from "@/lib/types";
import { badgeClass, buttonClass } from "@/lib/ui";
import { cn, formatCurrency, formatDate, formatTime, todayISO } from "@/lib/utils";

type Filter = BookingStatus | "All";

const filters: Filter[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export function MyBookingsClient() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [target, setTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    getMyBookings(user.email)
      .then((result) => {
        if (active) setBookings(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : "Couldn't load your bookings.";
        setError(message);
        toast.error("Bookings didn't load", { description: message });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const counts = useMemo(() => {
    return {
      All: bookings.length,
      Pending: bookings.filter((booking) => booking.status === "Pending").length,
      Confirmed: bookings.filter((booking) => booking.status === "Confirmed").length,
      Completed: bookings.filter((booking) => booking.status === "Completed").length,
      Cancelled: bookings.filter((booking) => booking.status === "Cancelled").length,
    } as Record<Filter, number>;
  }, [bookings]);

  const upcomingCount = bookings.filter(
    (booking) =>
      (booking.status === "Pending" || booking.status === "Confirmed") &&
      booking.date >= todayISO(),
  ).length;

  const completedTotal = bookings
    .filter((booking) => booking.status === "Completed")
    .reduce((total, booking) => total + booking.total, 0);

  const visible = useMemo(() => {
    const list = filter === "All" ? bookings : bookings.filter((booking) => booking.status === filter);
    const now = todayISO();
    return [...list].sort((a, b) => {
      const aPast = a.date < now;
      const bPast = b.date < now;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    });
  }, [bookings, filter]);

  async function confirmCancel() {
    if (!target || !user) return;
    setCancelling(true);
    try {
      const updated = await cancelBooking(target._id, user);
      setBookings((current) =>
        current.map((booking) => (booking._id === updated._id ? updated : booking)),
      );
      toast.success("Booking cancelled", {
        description: `${target.studioTitle} · ${formatDate(target.date, "weekday")} is now free.`,
      });
      setTarget(null);
    } catch (reason) {
      toast.error("Couldn't cancel the booking", {
        description: reason instanceof Error ? reason.message : "Please try again.",
      });
    } finally {
      setCancelling(false);
    }
  }

  if (!user) return null;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Upcoming sessions" value={String(upcomingCount)} hint="pending + confirmed" />
        <StatCard label="Requests waiting" value={String(counts.Pending)} hint="hosts will respond soon" />
        <StatCard
          label="Completed spend"
          value={formatCurrency(completedTotal)}
          hint={`${counts.Completed} finished bookings`}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors",
                filter === item
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted hover:text-foreground",
              )}
            >
              {item}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.58rem]",
                  filter === item ? "bg-black/15 dark:bg-white/15" : "bg-surface-2",
                )}
              >
                {counts[item]}
              </span>
            </button>
          ))}
        </div>
        <Link href="/studios" className={buttonClass({ variant: "outline", size: "sm" })}>
          <CalendarDays className="h-3.5 w-3.5" />
          Book another space
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {loading &&
          Array.from({ length: 3 }).map((_, index) => <ListRowSkeleton key={index} />)}

        {!loading && error && (
          <EmptyState
            icon={TriangleAlert}
            title="We couldn't reach your bookings"
            description={error}
            actionLabel="Reload page"
            onAction={() => window.location.reload()}
          />
        )}

        {!loading && !error && visible.length === 0 && (
          <EmptyState
            icon={CalendarDays}
            title={
              filter === "All"
                ? "No bookings on the call sheet yet"
                : `No ${filter.toLowerCase()} bookings`
            }
            description={
              filter === "All"
                ? "Find a room, pick your hours and send a request. Your reservations will show up here with live status updates."
                : "Try another status filter, or find a new space to book this week."
            }
            actionLabel={filter === "All" ? "Explore studios" : "Show all bookings"}
            actionHref={filter === "All" ? "/studios" : undefined}
            onAction={filter === "All" ? undefined : () => setFilter("All")}
            secondaryLabel={filter === "All" ? undefined : "Explore studios"}
            secondaryHref={filter === "All" ? undefined : "/studios"}
          />
        )}

        {!loading &&
          !error &&
          visible.map((booking) => (
            <article
              key={booking._id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row"
            >
              <Link
                href={`/studios/${booking.studioId}`}
                className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:aspect-auto sm:h-auto sm:w-44"
              >
                <Image
                  src={booking.studioImage}
                  alt={booking.studioTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, 176px"
                  className="object-cover"
                />
                <span className="absolute left-2 top-2">
                  <span className={badgeClass("neutral", "bg-black/55 text-white backdrop-blur")}>
                    {booking.studioCategory}
                  </span>
                </span>
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-semibold leading-snug">
                      <Link href={`/studios/${booking.studioId}`} className="hover:text-accent">
                        {booking.studioTitle}
                      </Link>
                    </h2>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                      <User className="h-3.5 w-3.5" />
                      Hosted by {booking.ownerName}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <CalendarDays className="h-3.5 w-3.5 text-accent" />
                    {formatDate(booking.date, "weekday")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    <span className="text-border">·</span>
                    {booking.hours} hr
                  </span>
                </div>

                {booking.note && (
                  <p className="mt-2 line-clamp-1 text-[0.72rem] italic text-muted">
                    “{booking.note}”
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                  <div>
                    <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-muted">
                      Total incl. deposit
                    </p>
                    <p className="font-display text-lg font-semibold">{formatCurrency(booking.total)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(booking.status === "Confirmed" || booking.status === "Completed") && (
                      <Link
                        href={`/invoice/${booking._id}`}
                        className={buttonClass({ variant: "outline", size: "sm" })}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Invoice
                      </Link>
                    )}
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className={buttonClass({ variant: "ghost", size: "sm" })}
                    >
                      View studio
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    {booking.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() => setTarget(booking)}
                        className={buttonClass({
                          variant: "outline",
                          size: "sm",
                          className: "border-red-500/30 text-red-500 hover:bg-red-500/10",
                        })}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
      </div>

      <Modal
        open={Boolean(target)}
        onClose={() => {
          if (!cancelling) setTarget(null);
        }}
        title="Cancel this booking?"
        description="This releases your hours back to the host's calendar."
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setTarget(null)}
              disabled={cancelling}
              className={buttonClass({ variant: "outline", size: "md" })}
            >
              Keep booking
            </button>
            <button
              type="button"
              onClick={() => void confirmCancel()}
              disabled={cancelling}
              className={buttonClass({ variant: "danger", size: "md" })}
            >
              {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              {cancelling ? "Cancelling…" : "Cancel booking"}
            </button>
          </div>
        }
      >
        {target && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4 text-xs leading-relaxed text-muted">
            <p className="font-bold text-foreground">{target.studioTitle}</p>
            <p className="mt-1">
              {formatDate(target.date, "long")} · {formatTime(target.startTime)} –{" "}
              {formatTime(target.endTime)}
            </p>
            <p className="mt-2">
              Only Pending bookings can be cancelled here. If your host has already confirmed, message
              them directly to change the date.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-[0.68rem] text-muted">{hint}</p>
    </div>
  );
}
