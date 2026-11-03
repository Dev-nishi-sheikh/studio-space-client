"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  Clock,
  Info,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { Modal } from "@/components/ui/modal";
import { createBooking, getBookedSlots } from "@/lib/api";
import { TIME_SLOTS } from "@/lib/constants";
import type { Studio } from "@/lib/types";
import { buttonClass } from "@/lib/ui";
import {
  addDaysISO,
  formatCurrency,
  formatDate,
  formatTime,
  hoursBetween,
  timeToMinutes,
  todayISO,
} from "@/lib/utils";

export function BookingModal({
  studio,
  open,
  onClose,
}: {
  studio: Studio;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState(addDaysISO(1));
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots] = useState<
    { startTime: string; endTime: string; status: string }[]
  >([]);

  const hours = hoursBetween(startTime, endTime);
  const subtotal = Math.round(studio.hourlyRate * hours);
  const total = subtotal + studio.securityDeposit;

  const endOptions = useMemo(
    () => TIME_SLOTS.filter((slot) => timeToMinutes(slot) > timeToMinutes(startTime)),
    [startTime],
  );

  useEffect(() => {
    if (!open) return;
    setError(null);
  }, [open]);

  useEffect(() => {
    if (!open || !date) return;
    let active = true;
    getBookedSlots(studio._id, date)
      .then((result) => {
        if (active) setSlots(Array.isArray(result) ? result : []);
      })
      .catch(() => {
        if (active) setSlots([]);
      });
    return () => {
      active = false;
    };
  }, [open, date, studio._id]);

  useEffect(() => {
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      const fallback = TIME_SLOTS.find(
        (slot) => timeToMinutes(slot) >= timeToMinutes(startTime) + 120,
      );
      setEndTime(fallback ?? endOptions[endOptions.length - 1] ?? "18:00");
    }
    // Only correct the range when the start changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!user) {
      toast.error("Log in to reserve this space", {
        description: "Your booking will be attached to your StudioSpace account.",
      });
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`);
      return;
    }
    if (hours < 1) {
      const message = "Pick an end time later than your start time (minimum one hour).";
      setError(message);
      toast.error("Check your shoot hours", { description: message });
      return;
    }
    if (date < todayISO()) {
      const message = "Choose a date from today onwards.";
      setError(message);
      toast.error("That date has passed", { description: message });
      return;
    }

    setSubmitting(true);
    try {
      await createBooking(
        {
          studioId: studio._id,
          date,
          startTime,
          endTime,
          guests,
          note: note.trim() || undefined,
        },
        user,
      );
      toast.success("Reservation sent", {
        description: `${studio.title} · ${formatDate(date, "weekday")}, ${formatTime(startTime)}–${formatTime(endTime)}. Track it under My bookings.`,
      });
      onClose();
      router.push("/my-bookings");
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "We couldn't save that reservation.";
      setError(message);
      toast.error("Booking not completed", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reserve this workspace"
      description={`${studio.title} · ${studio.location}`}
      size="md"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted">
              Total due to confirm
            </p>
            <p className="font-display text-2xl font-semibold">{formatCurrency(total)}</p>
          </div>
          <button
            type="submit"
            form="booking-form"
            disabled={submitting}
            className={buttonClass({ size: "md", className: "sm:min-w-[12rem]" })}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending request…
              </>
            ) : (
              <>
                Request booking
                <Check className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      }
    >
      <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-xs font-medium text-red-600 dark:text-red-400"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="booking-date" className="label">
              Shoot date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="booking-date"
                type="date"
                min={todayISO()}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="booking-start" className="label">
              Start time
            </label>
            <select
              id="booking-start"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="field"
            >
              {TIME_SLOTS.slice(0, -1).map((slot) => (
                <option key={slot} value={slot}>
                  {formatTime(slot)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="booking-end" className="label">
              End time
            </label>
            <select
              id="booking-end"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="field"
            >
              {endOptions.map((slot) => (
                <option key={slot} value={slot}>
                  {formatTime(slot)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {slots.length > 0 && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 px-3.5 py-3 text-[0.7rem] leading-relaxed text-amber-700 dark:text-amber-300">
            <p className="font-bold">Already on the calendar</p>
            <p className="mt-0.5">
              {slots
                .map((slot) => `${formatTime(slot.startTime)}–${formatTime(slot.endTime)}`)
                .join(" · ")}
            </p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-guests" className="label">
              People on set
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1">
              <button
                type="button"
                aria-label="Fewer guests"
                onClick={() => setGuests((value) => Math.max(1, value - 1))}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="flex-1 text-center text-sm font-bold">{guests}</span>
              <button
                type="button"
                aria-label="More guests"
                onClick={() => setGuests((value) => Math.min(studio.capacity, value + 1))}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label className="label">Booked hours</label>
            <div className="flex h-[42px] items-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-bold">
              <Clock className="h-4 w-4 text-accent" />
              {hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "—"}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="booking-note" className="label">
            Production note <span className="font-medium text-muted">(optional)</span>
          </label>
          <textarea
            id="booking-note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Crew size, load-in needs, what you're shooting…"
            className="field resize-none"
          />
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-background p-3.5 text-xs">
          <div className="flex items-center justify-between text-muted">
            <span>
              {formatCurrency(studio.hourlyRate)} × {hours || 0} hr
            </span>
            <span className="font-bold text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span className="inline-flex items-center gap-1">
              Security deposit
              <Info className="h-3 w-3" />
            </span>
            <span className="font-bold text-foreground">{formatCurrency(studio.securityDeposit)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
            <span className="font-bold">Total</span>
            <span className="font-display text-lg font-semibold">{formatCurrency(total)}</span>
          </div>
          <p className="flex items-start gap-1.5 pt-1 text-[0.65rem] leading-relaxed text-muted">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            The security deposit is refundable and released by the host after your shoot. Your
            request stays Pending until the host confirms.
          </p>
        </div>
      </form>
    </Modal>
  );
}
