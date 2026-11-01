import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/section-heading";

export function BrowseCategories() {
  return (
    <section className="border-y border-border bg-surface py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Browse by room"
          title={
            <>
              What are you
              <br className="hidden sm:block" /> making today?
            </>
          }
          description="Five kinds of space, each built for a different kind of production. Start with the room — we'll handle the rest."
          actionLabel="See every category"
          actionHref="/studios"
        />

        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.name}
              href={`/studios?category=${encodeURIComponent(category.name)}`}
              className="group relative aspect-[3/4] w-[68vw] shrink-0 snap-start overflow-hidden rounded-[1.35rem] border border-border bg-background sm:w-[42vw] lg:w-auto"
            >
              <Image
                src={category.image}
                alt={category.label}
                fill
                sizes="(max-width: 640px) 68vw, (max-width: 1024px) 42vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/5 opacity-90 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-white/50">
                  0{index + 1}
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-lime-foreground">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-xl font-semibold leading-tight text-white">
                  {category.label}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[0.7rem] leading-relaxed text-white/60">
                  {category.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
