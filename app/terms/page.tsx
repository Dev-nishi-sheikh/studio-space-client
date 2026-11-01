import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { buttonClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Terms & privacy",
  description: "The terms of use and privacy commitments for the StudioSpace marketplace.",
};

const sections = [
  {
    title: "1. Using StudioSpace",
    body: [
      "StudioSpace is a peer-to-peer marketplace that connects creators with independent studio hosts. We are not the owner or operator of the spaces listed, and we do not supervise productions that take place in them.",
      "You must be at least 18 years old and able to enter a binding agreement to create an account or make a booking. Account details must be accurate, and you are responsible for activity carried out under your account.",
    ],
  },
  {
    title: "2. Listings and bookings",
    body: [
      "Hosts are responsible for the accuracy of their listings, including photos, capacity, amenities, access details and pricing. Rates and security deposits are shown before a request is submitted.",
      "A reservation starts as Pending and becomes Confirmed when the host accepts it. Pending bookings can be cancelled from My Bookings. Confirmed bookings can only be changed with the host's agreement.",
    ],
  },
  {
    title: "3. Payments and deposits",
    body: [
      "Booking totals are settled directly between the creator and the host on the shoot day unless otherwise stated on the listing. The refundable security deposit is held by the host and released after the space has been checked.",
      "StudioSpace does not process payments on behalf of hosts in this version of the marketplace. Any chargebacks, refunds or deposit disputes should first be raised with the host.",
    ],
  },
  {
    title: "4. Cancellations and conduct",
    body: [
      "Creators and hosts are expected to communicate promptly and honestly. Repeated no-shows, unsafe behaviour or misrepresentation of a listing may result in account suspension.",
      "Productions must respect the capacity, house rules and local regulations attached to each space. Damage caused during a booking is the responsibility of the booking creator.",
    ],
  },
  {
    title: "5. Liability and support",
    body: [
      "Confirmed bookings include host liability protection as described on the listing and How It Works pages. This cover does not replace your own production insurance where one is required.",
      "Our support team is available around the clock for booking issues. Contact support@studiospace.com and include your booking reference so we can help quickly.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="The fine print"
        title="Terms, plainly written."
        description="The rules that keep a peer-to-peer marketplace fair for the people hosting rooms and the people making work in them. Last updated October 2026."
      />

      <div className="container-x py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-muted">
              On this page
            </p>
            <nav className="mt-3 space-y-2 text-xs">
              {[...sections.map((section, index) => ({ label: section.title, id: `section-${index}` })), { label: "Privacy", id: "privacy" }].map(
                (item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>
            <div className="mt-6 rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-bold">Need a human?</p>
              <p className="mt-1 text-[0.68rem] leading-relaxed text-muted">
                Write to support@studiospace.com and we&apos;ll reply within one business day.
              </p>
              <Link href="/how-it-works" className="mt-3 inline-flex items-center gap-1 text-[0.68rem] font-bold text-accent">
                Read how booking works
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>

          <div className="max-w-2xl">
            <div className="space-y-9">
              {sections.map((section, index) => (
                <section key={section.title} id={`section-${index}`} className="scroll-mt-28">
                  <h2 className="font-display text-xl font-semibold">{section.title}</h2>
                  <div className="mt-3 space-y-3 text-[0.85rem] leading-[1.8] text-muted">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section id="privacy" className="scroll-mt-28">
                <h2 className="font-display text-xl font-semibold">6. Privacy</h2>
                <div className="mt-3 space-y-3 text-[0.85rem] leading-[1.8] text-muted">
                  <p>
                    We collect the name, email address and profile photo you provide when you join,
                    along with the listings and bookings you create. This information is used to run
                    the marketplace, send booking updates and keep hosts and creators accountable.
                  </p>
                  <p>
                    Passwords are never stored in plain text by the production server. Authentication
                    sessions are held in HTTPOnly cookies so client-side scripts cannot read them.
                    Payment card details are not collected by StudioSpace in this version.
                  </p>
                  <p>
                    We do not sell personal data. You can request a copy or deletion of your account
                    data at any time by writing to privacy@studiospace.com.
                  </p>
                </div>
              </section>

              <div className="rounded-2xl border border-border bg-surface p-5 text-xs leading-relaxed text-muted">
                <p className="font-bold text-foreground">A note for the examiner</p>
                <p className="mt-1">
                  This is a student project. Bookings and payments are simulated in the demo
                  environment and no real transactions take place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-border pt-8">
                <Link href="/studios" className={buttonClass({ size: "md" })}>
                  Explore studios
                </Link>
                <Link href="/" className={buttonClass({ variant: "outline", size: "md" })}>
                  Return home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
