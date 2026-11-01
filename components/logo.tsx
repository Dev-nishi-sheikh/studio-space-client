import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="StudioSpace home"
      className={cn("group inline-flex shrink-0 items-center gap-2.5", className)}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground transition-transform duration-500 group-hover:rotate-45">
        <Aperture className="h-[19px] w-[19px]" strokeWidth={2.1} />
      </span>
      {!compact && (
        <span className="font-display text-[1.32rem] font-semibold leading-none tracking-[-0.055em]">
          studio<span className="text-accent">space</span>
          <span className="text-accent">.</span>
        </span>
      )}
    </Link>
  );
}
