"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock,
  Download,
  MapPin,
  Printer,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { Logo } from "@/components/logo";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { getBooking } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { buttonClass } from "@/lib/ui";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export function InvoiceClient({ id }: { id: string }) {
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getBooking(id)
      .then((result) => {
        if (active) setBooking(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : "Couldn't load this invoice.";
        setError(message);
        toast.error("Invoice unavailable", { description: message });
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
      <div className="container-x py-10">
        <Skeleton className="mx-auto h-[620px] w-full max-w-4xl rounded-[1.5rem]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={TriangleAlert}
          title="This invoice couldn't be opened"
          description={error}
          actionLabel="Back to bookings"
          actionHref="/my-bookings"
        />
      </div>
    );
  }

  if (!booking || !user || booking.userEmail !== user.email) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={TriangleAlert}
          title="That invoice isn't on your account"
          description="Invoices are only visible to the creator who made the booking. Head back to your call sheet to find yours."
          actionLabel="My bookings"
          actionHref="/my-bookings"
        />
      </div>
    );
  }

  const issued = new Date(booking.createdAt);
  const invoiceNumber = `SS-${booking._id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase()}`;

  return (
    <div className="container-x py-8 sm:py-12">
      <div className="print-hidden mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to my bookings
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/studios/${booking.studioId}`}
            className={buttonClass({ variant: "outline", size: "sm" })}
          >
            View studio
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className={buttonClass({ size: "sm" })}
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="invoice-sheet mx-auto mt-5 max-w-4xl overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-[0_30px_80px_-50px_rgba(0,0,0,0.6)]">
        <div className="border-b border-border px-6 py-7 sm:px-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <Logo />
              <p className="mt-3 max-w-[16rem] text-[0.7rem] leading-relaxed text-muted">
                Peer-to-peer creative workspace marketplace.
                <br />
                hello@studiospace.com · studiospace.com
              </p>
            </div>
            <div className="text-right">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-muted">
                Booking invoice
              </p>
              <p className="mt-1 font-display text-2xl font-semibold print-accent">{invoiceNumber}</p>
              <p className="mt-1 text-[0.7rem] text-muted">
                Issued {issued.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              <div className="mt-2 flex justify-end">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-7 sm:grid-cols-3 sm:px-10">
          <div>
            <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-muted">
              Billed to
            </p>
            <p className="mt-2 text-sm font-bold">{booking.userName}</p>
            <p className="text-xs text-muted">{booking.userEmail}</p>
          </div>
          <div>
            <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-muted">
              Hosted by
            </p>
            <p className="mt-2 flex items-center gap-1 text-sm font-bold">
              {booking.ownerName}
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
            </p>
            <p className="text-xs text-muted">{booking.ownerEmail}</p>
          </div>
          <div>
            <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-muted">
              Reference
            </p>
            <p className="mt-2 text-sm font-bold">#{booking._id}</p>
            <p className="text-xs text-muted">Paid directly to host</p>
          </div>
        </div>

        <div className="px-6 sm:px-10">
          <div className="rounded-xl border border-border">
            <div className="border-b border-border bg-background/50 px-4 py-3">
              <p className="text-sm font-bold">{booking.studioTitle}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-muted">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-accent" />
                  {booking.studioCategory}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(booking.date, "long")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                </span>
              </p>
            </div>

            <div className="divide-y divide-border text-xs">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 text-muted">
                <span>Studio hours</span>
                <span>
                  {formatCurrency(
                    booking.hours > 0 ? Math.round(booking.subtotal / booking.hours) : 0,
                  )}{" "}
                  × {booking.hours} hrs
                </span>
                <span className="w-20 text-right font-bold text-foreground">
                  {formatCurrency(booking.subtotal)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 text-muted">
                <span>Refundable security deposit</span>
                <span>Released after shoot</span>
                <span className="w-20 text-right font-bold text-foreground">
                  {formatCurrency(booking.deposit)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-background/50 px-4 py-3.5">
                <span className="font-bold">Total</span>
                <span />
                <span className="w-20 text-right font-display text-lg font-semibold print-accent">
                  {formatCurrency(booking.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-7 sm:grid-cols-2 sm:px-10">
          <div>
            <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-muted">
              Notes
            </p>
            <p className="mt-2 text-[0.7rem] leading-relaxed text-muted">
              {booking.status === "Completed"
                ? "This shoot has been completed. The security deposit is released by the host within 3 business days."
                : booking.status === "Confirmed"
                  ? "Your host has confirmed this reservation. The booking total is settled directly with the host on the shoot day."
                  : booking.status === "Pending"
                    ? "This reservation is awaiting host confirmation. No charge has been made yet."
                    : "This booking was cancelled and this invoice is retained for your records."}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-muted">
              Questions?
            </p>
            <p className="mt-2 text-[0.7rem] leading-relaxed text-muted">
              support@studiospace.com
              <br />
              StudioSpace · Los Angeles, CA
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[0.62rem] font-bold text-muted">
              <Printer className="h-3 w-3" />
              Use “Download PDF” to save a copy
            </p>
          </div>
        </div>

        <div className="border-t border-border bg-background/50 px-6 py-4 text-center text-[0.62rem] text-muted sm:px-10">
          Thank you for making something. · StudioSpace © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
