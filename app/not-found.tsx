import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Aperture, ArrowLeft, Compass, Sparkles } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { buttonClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This set is empty — the StudioSpace page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <section className="container-x py-6 sm:py-10">
      <div className="relative min-h-[72vh] overflow-hidden rounded-[2rem] border border-border bg-[#0b0b0d]">
        <Image
          src={IMAGES.photoLights}
          alt="An empty studio lit by a single light"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(240,76,35,0.28),transparent_45%),linear-gradient(180deg,rgba(9,9,11,0.3),rgba(9,9,11,0.95))]" />
        <div className="noise absolute inset-0" />

        <div className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center px-6 py-16 text-center text-white">
          <span className="relative grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-black/25 backdrop-blur">
            <span className="absolute inset-0 animate-ping rounded-full border border-lime/30" />
            <Aperture className="h-7 w-7 text-lime" strokeWidth={1.5} />
          </span>

          <p className="mt-6 font-display text-[clamp(5.5rem,18vw,11rem)] font-semibold leading-[0.8] tracking-[-0.08em] text-white">
            404
          </p>

          <div className="mt-5 flex items-center gap-2 text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-white/50">
            <Sparkles className="h-3.5 w-3.5 text-lime" />
            This set is empty
            <Sparkles className="h-3.5 w-3.5 text-lime" />
          </div>

          <h1 className="mt-3 max-w-lg font-display text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
            The page you&apos;re looking for never made it to the call sheet.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
            It may have moved, wrapped, or been struck from the schedule. The rest of the studio is
            still open.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className={buttonClass({
                size: "lg",
                className: "bg-lime text-lime-foreground hover:brightness-105",
              })}
            >
              <ArrowLeft className="h-4 w-4" />
              Return home
            </Link>
            <Link
              href="/studios"
              className={buttonClass({
                variant: "outline",
                size: "lg",
                className: "border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/15",
              })}
            >
              <Compass className="h-4 w-4" />
              Explore studios
            </Link>
          </div>

          <p className="mt-8 text-[0.65rem] text-white/35">
            Still lost? Write to support@studiospace.com — we&apos;ll point you to the right room.
          </p>
        </div>
      </div>
    </section>
  );
}
