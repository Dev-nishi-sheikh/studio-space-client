"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Play } from "lucide-react";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IMAGES } from "@/lib/images";
import { buttonClass } from "@/lib/ui";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: IMAGES.photoLoft,
    kicker: "Photo studios · Los Angeles",
    title: (
      <>
        Rooms that make
        <br />
        <span className="text-lime">the work.</span>
      </>
    ),
    description:
      "Daylight lofts, blackout stages and quiet corners — booked by the hour, direct from the people who built them.",
    venue: "The Daylight Loft",
    location: "Arts District",
    stat: "From $85 / hr",
    note: "12ft cyc wall included",
  },
  {
    image: IMAGES.filmStage,
    kicker: "Sound stages · Burbank",
    title: (
      <>
        Bring the big idea.
        <br />
        We&apos;ll bring the stage.
      </>
    ),
    description:
      "Drive-on docks, silent HVAC and rigging-ready grids. Production spaces that keep the day moving.",
    venue: "Stage 09 — Cinema Sound Stage",
    location: "Burbank",
    stat: "45 person capacity",
    note: "Loading dock + green room",
  },
  {
    image: IMAGES.podcast,
    kicker: "Podcast rooms · Silver Lake",
    title: (
      <>
        Quiet enough to
        <br />
        <span className="text-lime">hear the story.</span>
      </>
    ),
    description:
      "Treated rooms, broadcast mics and an engineer on call. Press record without wrestling the room.",
    venue: "Lowlight Podcast Lounge",
    location: "Silver Lake",
    stat: "From $55 / hr",
    note: "Mics and interface ready",
  },
];

export function HeroSlider() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section className="container-x pt-5">
      <h1 className="sr-only">
        StudioSpace — book peer-to-peer photo studios, sound stages, podcast rooms, music suites and
        workshops by the hour.
      </h1>
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-[#0b0b0d] sm:rounded-[2.25rem]">
        <Swiper
          modules={[Autoplay]}
          loop
          speed={750}
          autoplay={{ delay: 6200, disableOnInteraction: false, pauseOnMouseEnter: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActive(swiper.realIndex)}
          className="h-[620px] w-full sm:h-[660px] lg:h-[730px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.venue}>
              <div className="relative h-full w-full">
                <Image
                  src={slide.image}
                  alt={slide.venue}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
                <div className="hero-overlay absolute inset-0" />
                <div className="noise absolute inset-0" />

                <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 text-white sm:px-9 sm:pb-28 lg:px-14 lg:pb-28">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                      </span>
                      <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-white/80">
                        {slide.kicker}
                      </span>
                    </div>

                    <p className="display-hero mt-5 text-white">{slide.title}</p>
                    <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-white/70 sm:text-base">
                      {slide.description}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <Link
                        href="/studios"
                        className={buttonClass({
                          size: "lg",
                          className: "bg-lime text-lime-foreground hover:brightness-105",
                        })}
                      >
                        Explore studios
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/add-studio"
                        className={buttonClass({
                          variant: "outline",
                          size: "lg",
                          className: "border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/15",
                        })}
                      >
                        <Play className="h-4 w-4 fill-current" />
                        Host your space
                      </Link>
                    </div>

                    <div className="mt-8 flex max-w-md items-center gap-5 border-t border-white/20 pt-5">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate text-xs font-bold text-white">
                          <MapPin className="h-3.5 w-3.5 text-lime" />
                          {slide.venue}
                        </p>
                        <p className="mt-1 text-[0.68rem] text-white/55">
                          {slide.location} · {slide.note}
                        </p>
                      </div>
                      <span className="ml-auto shrink-0 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[0.68rem] font-bold text-white/90 backdrop-blur">
                        {slide.stat}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute right-5 top-5 z-20 hidden items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3.5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          Now booking · this week
        </div>

        <div className="absolute inset-x-5 bottom-5 z-20 flex items-center justify-between gap-4 sm:inset-x-8">
          <div className="flex items-center gap-2.5">
            {slides.map((slide, index) => (
              <button
                key={slide.venue}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  active === index ? "w-10 bg-white" : "w-5 bg-white/30 hover:bg-white/60",
                )}
              />
            ))}
            <span className="ml-2 text-[0.65rem] font-bold tracking-[0.16em] text-white/60">
              0{active + 1} / 0{slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
