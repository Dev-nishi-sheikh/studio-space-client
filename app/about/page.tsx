import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Layers, Sparkles, Users } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { HostCta } from "@/components/home/host-cta";
import { IMAGES } from "@/lib/images";
import { buttonClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "About us",
  description:
    "StudioSpace is a peer-to-peer marketplace connecting creators with independent studios, stages and production rooms.",
};

const values = [
  {
    icon: Layers,
    title: "Access over ownership",
    text: "Most creators don't need a permanent studio. They need the right room for three hours on a Thursday. We build for that.",
  },
  {
    icon: Users,
    title: "Hosts are collaborators",
    text: "A great studio is shaped by the person who runs it. We give hosts the tools and visibility to run their space on their terms.",
  },
  {
    icon: Sparkles,
    title: "Transparency by default",
    text: "Real photos, real rates, real availability. No hidden fees, no mystery deposits, no emails that go unanswered for a week.",
  },
];

const team = [
  { name: "Mara Voss", role: "Co-founder & host community", image: IMAGES.avatarMara },
  { name: "Harry Chen", role: "Co-founder & product", image: IMAGES.avatarHarry },
  { name: "Idris Cole", role: "Production partnerships", image: IMAGES.avatarIdris },
  { name: "Sana Park", role: "Creator experience", image: IMAGES.avatarSana },
];

const stats = [
  { value: "480+", label: "creative spaces" },
  { value: "12k", label: "creators booked" },
  { value: "4.9", label: "average rating" },
  { value: "24/7", label: "creator support" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About StudioSpace"
        title={
          <>
            Rooms are
            <br />
            infrastructure
            <br />
            for ideas.
          </>
        }
        description="We connect the people who make things with the people who built the right room for it — directly, transparently and by the hour."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/studios" className={buttonClass({ size: "md" })}>
            Explore studios
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/how-it-works" className={buttonClass({ variant: "outline", size: "md" })}>
            How it works
          </Link>
        </div>
      </PageHero>

      <section className="container-x py-16 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border">
              <Image
                src={IMAGES.photoLights}
                alt="A photographer arranging lights inside a StudioSpace studio"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 -right-2 w-44 rotate-[-3deg] rounded-2xl border border-border bg-lime p-4 text-lime-foreground shadow-xl sm:-right-6 sm:w-52">
              <p className="font-display text-3xl font-semibold">1M+</p>
              <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
                host liability cover
              </p>
            </div>
          </div>

          <div>
            <span className="eyebrow">Why we built it</span>
            <h2 className="display-section mt-4">
              The best studio
              <br />
              isn&apos;t always yours.
            </h2>
            <div className="mt-5 space-y-4 text-[0.92rem] leading-[1.8] text-muted">
              <p>
                StudioSpace started with a familiar problem: a photographer with a client, a date
                and no cyc wall. The rooms existed. Finding one — and trusting that it was real —
                was the hard part.
              </p>
              <p>
                We built a marketplace around the people who actually run those rooms. Independent
                hosts, production companies, converted warehouses and small recording suites. Each
                listing is a working space, not a stock photo.
              </p>
              <p>
                Today, creators use StudioSpace to find everything from a daylight loft for a
                lookbook to a 45-person sound stage for a two-day commercial. Hosts use it to fill
                the quiet hours without handing their calendar to an agency.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-0.5 text-[0.65rem] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-24">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">What we believe</span>
            <h2 className="display-section mt-4">Three things we refuse to compromise on.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="relative overflow-hidden rounded-[1.35rem] border border-border bg-background p-6"
              >
                <span className="absolute -right-1 -top-4 font-display text-[5.5rem] leading-none text-foreground/[0.04]">
                  0{index + 1}
                </span>
                <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-accent/12 text-accent">
                  <value.icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-5 font-display text-xl font-semibold">{value.title}</h3>
                <p className="relative mt-2 text-[0.82rem] leading-relaxed text-muted">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">The people</span>
            <h2 className="display-section mt-4">Small team. Long call sheets.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We&apos;re producers, photographers and hosts who got tired of the group-chat booking
              process. We still shoot. That keeps the product honest.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-[0.65rem] font-bold text-muted">
            <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
            Based in Los Angeles
          </span>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person) => (
            <div key={person.name} className="group overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <p className="font-display text-lg font-semibold">{person.name}</p>
                <p className="mt-0.5 text-[0.68rem] text-muted">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HostCta />
    </>
  );
}
