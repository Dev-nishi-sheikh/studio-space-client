import Link from "next/link";
import { ArrowUpRight, Aperture, Mail } from "lucide-react";
import { buttonClass } from "@/lib/ui";

export function HostCta() {
  return (
    <section className="container-x py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-foreground px-6 py-14 text-background sm:px-12 sm:py-20">
        <Aperture
          className="pointer-events-none absolute -right-14 -top-14 h-72 w-72 text-background/[0.07]"
          strokeWidth={0.7}
        />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-lime/10 blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-background/60">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            For studio owners
          </span>
          <h2 className="display-section mt-6 text-background">
            Your space could be
            <br />
            someone&apos;s best shoot yet.
          </h2>
          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-background/60">
            List your studio in ten minutes, set your own rate and keep the calendar on your terms.
            You host. We handle the booking, the paperwork and the support.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/add-studio"
              className={buttonClass({
                size: "lg",
                className: "bg-lime text-lime-foreground hover:brightness-105",
              })}
            >
              Start a listing
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className={buttonClass({
                variant: "outline",
                size: "lg",
                className: "border-background/25 text-background hover:bg-background/10",
              })}
            >
              <Mail className="h-4 w-4" />
              Talk to the team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
