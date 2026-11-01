import Image from "next/image";
import { IMAGES } from "@/lib/images";

export function AuthShell({
  children,
  image = IMAGES.photoLoft,
  quote,
  attribution,
}: {
  children: React.ReactNode;
  image?: string;
  quote?: string;
  attribution?: string;
}) {
  return (
    <div className="container-x py-8 sm:py-12">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div className="flex items-center justify-center py-4">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="relative hidden min-h-[640px] overflow-hidden rounded-[2rem] border border-border lg:block">
          <Image
            src={image}
            alt="A creative studio listed on StudioSpace"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
          <div className="noise absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-9 text-white">
            <div className="mb-4 flex items-center gap-2 text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              From the StudioSpace community
            </div>
            <p className="max-w-md font-display text-2xl font-medium leading-snug tracking-[-0.03em]">
              “{quote ?? "The room was ready, the light was right, and the host had already thought of everything we forgot."}”
            </p>
            <p className="mt-4 text-xs font-semibold text-white/55">
              {attribution ?? "Mia Torres · Director, Los Angeles"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
