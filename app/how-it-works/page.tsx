import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  ClipboardCheck,
  CreditCard,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { HostCta } from "@/components/home/host-cta";
import { IMAGES } from "@/lib/images";
import { buttonClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How creators book creative studios and how hosts list, price and manage their spaces on StudioSpace.",
};

const creatorSteps = [
  {
    number: "01",
    icon: Search,
    title: "Find the right room",
    text: "Search by neighbourhood, room type or hourly rate. Every listing shows real photos, capacity, amenities and the host behind it.",
    image: IMAGES.podcast,
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Check the details",
    text: "Read the overview, scan the amenity list and look at reviews from creators who have already booked. No surprises on arrival.",
    image: IMAGES.photoCyc,
  },
  {
    number: "03",
    icon: CalendarDays,
    title: "Pick your hours",
    text: "Choose a date, start and end time. The full price — hours, deposit and total — updates before you send the request.",
    image: IMAGES.filmCrew,
  },
  {
    number: "04",
    icon: Camera,
    title: "Book, confirm, create",
    text: "Reservations start as Pending. Once the host confirms, your date is locked. Manage everything, including invoices, from My Bookings.",
    image: IMAGES.music,
  },
];

const faqs = [
  {
    question: "How quickly will a host respond to my booking?",
    answer:
      "Most hosts reply within a few hours. Your reservation stays Pending until they confirm, and you can cancel it from My Bookings at any point while it is pending.",
  },
  {
    question: "When am I charged?",
    answer:
      "Nothing is charged when you send a request. The booking total is settled directly with the host on the shoot day, and the refundable security deposit is released after the room is checked.",
  },
  {
    question: "What happens if I need to change the date?",
    answer:
      "Pending bookings can be cancelled and rebooked from your call sheet. For confirmed bookings, message the host directly — most are happy to move a session when the calendar allows.",
  },
  {
    question: "Are hosts and studios verified?",
    answer:
      "Yes. Hosts submit ID and space details before their first listing goes live, and every confirmed booking includes host liability protection.",
  },
  {
    question: "Can I book a studio for a full day?",
    answer:
      "Yes. Choose a start and end time that covers the day. The price is calculated by the hour, and the total updates before you submit the request.",
  },
  {
    question: "How do I list my own space?",
    answer:
      "Create an account, open Add New Studio and add the room, images, amenities and rate. You can edit or remove the listing at any time from My Studio Listings.",
  },
];

const hostSteps = [
  { icon: Sparkles, title: "Describe the room", text: "Photos, amenities, capacity and access details. We guide you through it." },
  { icon: CreditCard, title: "Set your rate", text: "Choose an hourly rate and a refundable security deposit that works for you." },
  { icon: ShieldCheck, title: "Host with cover", text: "Verified profiles, liability protection and a support team that answers." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            Book a room.
            <br />
            Make the thing.
          </>
        }
        description="No agency, no back-and-forth email chain. StudioSpace keeps the room, the hours and the price in one clear flow — for creators and hosts."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/studios" className={buttonClass({ size: "md" })}>
            Explore studios
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/add-studio" className={buttonClass({ variant: "outline", size: "md" })}>
            List your space
          </Link>
        </div>
      </PageHero>

      <section className="container-x py-16 sm:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow">For creators</span>
          <h2 className="display-section mt-4">Four steps from search to set.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            The booking flow is built to answer the questions a producer actually asks: what does
            it look like, what&apos;s included, and what will it cost?
          </p>
        </div>

        <div className="mt-12 space-y-5 lg:space-y-8">
          {creatorSteps.map((step, index) => (
            <div
              key={step.number}
              className={`grid items-center gap-6 rounded-[1.5rem] border border-border bg-surface p-4 sm:p-6 lg:grid-cols-2 lg:gap-12 ${
                index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-2">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
                  Step {step.number}
                </span>
              </div>
              <div className="px-2 pb-4 lg:px-6 lg:pb-0">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/12 text-accent">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-3xl font-medium tracking-[-0.04em]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{step.text}</p>
                <ul className="mt-5 space-y-2">
                  {["Transparent pricing", "Real host details", "Live availability"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs font-semibold">
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-lime text-lime-foreground">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-24">
        <div className="container-x">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <span className="eyebrow">For hosts</span>
              <h2 className="display-section mt-4">
                Your room.
                <br />
                Your calendar.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                Listing a space takes about ten minutes. You choose the rate, the hours and the
                house rules. We bring the creators, the booking flow and the support.
              </p>

              <div className="mt-8 space-y-5">
                {hostSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background text-accent">
                      <step.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">
                        <span className="mr-2 text-[0.6rem] font-extrabold tracking-[0.16em] text-muted">
                          0{index + 1}
                        </span>
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/add-studio" className={buttonClass({ size: "md", className: "mt-8" })}>
                Start a listing
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-border">
                <Image
                  src={IMAGES.interior}
                  alt="A host's studio space ready for a production"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-border bg-background p-4 shadow-xl sm:left-8 sm:right-auto sm:w-72">
                <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-muted">
                  Host payout example
                </p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="font-display text-2xl font-semibold">$340</p>
                  <p className="text-[0.65rem] text-muted">4 hrs · $85/hr</p>
                </div>
                <p className="mt-1 text-[0.65rem] text-muted">Deposit held separately and refunded.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="eyebrow">Good to know</span>
            <h2 className="display-section mt-4">Questions, answered.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Still unsure about something? Write to{" "}
              <a href="mailto:support@studiospace.com" className="font-bold text-accent hover:underline">
                support@studiospace.com
              </a>{" "}
              and a real person will reply.
            </p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold marker:hidden">
                  {faq.question}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-muted transition-transform group-open:rotate-45">
                    <span className="text-base leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-xl text-[0.83rem] leading-relaxed text-muted">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HostCta />
    </>
  );
}
