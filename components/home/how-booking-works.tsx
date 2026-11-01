import Link from "next/link";
import { CalendarDays, Camera, CheckCircle2, Search, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonClass } from "@/lib/ui";

const steps = [
  {
    icon: Search,
    title: "Discover spaces",
    text: "Filter by room type, neighbourhood and hourly rate. Every listing has real photos and a real host behind it.",
  },
  {
    icon: CalendarDays,
    title: "Select shoot hours",
    text: "Check live availability, set your start and end time, and see the full price before you commit.",
  },
  {
    icon: CheckCircle2,
    title: "Book instantly",
    text: "Send a reservation in a few clicks. Your host confirms, and the date is locked to your calendar.",
  },
  {
    icon: Camera,
    title: "Create & produce",
    text: "Load in, make the thing, load out. Your booking, invoice and host details all live in one place.",
  },
];

export function HowBookingWorks() {
  return (
    <section className="container-x py-16 sm:py-24">
      <SectionHeading
        eyebrow="How booking works"
        title={
          <>
            From idea to call sheet
            <br className="hidden sm:block" /> in four steps.
          </>
        }
        description="No back-and-forth emails, no mystery pricing. StudioSpace keeps the whole booking in one place so you can get back to the work."
        actionLabel="Find a space"
        actionHref="/studios"
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="group relative overflow-hidden rounded-[1.35rem] border border-border bg-surface p-6 transition-colors hover:border-accent/40"
          >
            <span className="absolute -right-1 -top-3 font-display text-[5rem] font-semibold leading-none tracking-[-0.06em] text-foreground/[0.045] transition-colors group-hover:text-accent/10">
              0{index + 1}
            </span>
            <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-border bg-background text-accent">
              <step.icon className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <p className="relative mt-6 text-[0.6rem] font-extrabold uppercase tracking-[0.22em] text-muted">
              Step 0{index + 1}
            </p>
            <h3 className="relative mt-1.5 font-display text-xl font-semibold">{step.title}</h3>
            <p className="relative mt-2 text-[0.8rem] leading-relaxed text-muted">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[1.35rem] border border-dashed border-border px-6 py-5 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">
          <span className="font-bold text-foreground">Need a room this week?</span> Most hosts
          respond within a few hours.
        </p>
        <Link href="/studios" className={buttonClass({ size: "sm" })}>
          Explore studios
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
