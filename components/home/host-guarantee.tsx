import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Headphones, ShieldCheck, Star, Wrench, ArrowUpRight } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { buttonClass } from "@/lib/ui";

const assurances = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    text: "Every confirmed booking includes $1M in host liability cover.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    text: "Hosts and creators are ID-checked before their first booking.",
  },
  {
    icon: Wrench,
    title: "Equipment safety",
    text: "A pre-shoot checklist keeps gear, rigging and load-in covered.",
  },
  {
    icon: Headphones,
    title: "24/7 creator support",
    text: "A real person on the line before, during and after the shoot.",
  },
];

export function HostGuarantee() {
  return (
    <section className="border-y border-border bg-surface py-16 sm:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-border lg:aspect-[5/4]">
            <Image
              src={IMAGES.photoCyc}
              alt="A host setting up a cyc wall inside a StudioSpace listing"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-3 rounded-2xl border border-border bg-background p-4 shadow-xl sm:left-8 sm:right-auto sm:w-[19rem]">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime text-lime-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Every host verified</p>
              <p className="text-xs text-muted">ID-checked · insured · responsive</p>
            </div>
            <span className="ml-auto flex items-center gap-1 text-xs font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              4.9
            </span>
          </div>

          <span className="absolute -right-3 -top-3 hidden rotate-6 rounded-full border border-border bg-lime px-4 py-2 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-lime-foreground shadow-lg sm:inline-flex">
            1M+ insured
          </span>
        </div>

        <div>
          <span className="eyebrow">Host guarantee &amp; creator support</span>
          <h2 className="display-section mt-4">
            You bring the idea.
            <br />
            We cover the room.
          </h2>
          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted">
            Behind every listing is a person who cares about their space. Our guarantee makes
            booking it feel as safe as shooting at home — without the clean-up.
          </p>

          <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {assurances.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-background text-accent">
                  <item.icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/add-studio" className={buttonClass({ size: "md" })}>
              List your space
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className={buttonClass({ variant: "outline", size: "md" })}
            >
              See host protections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
