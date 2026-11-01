import { Asterisk } from "lucide-react";

const words = [
  "Photo studios",
  "Sound stages",
  "Podcast rooms",
  "Music suites",
  "Art workshops",
  "Daylight lofts",
  "Blackout stages",
];

export function MarqueeStrip() {
  const row = [...words, ...words];
  return (
    <div className="marquee-wrap mt-5 overflow-hidden border-y border-border bg-lime py-3.5 text-lime-foreground">
      <div className="marquee-track items-center gap-0">
        {row.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="flex shrink-0 items-center gap-5 pr-5 font-display text-sm font-semibold uppercase tracking-[0.08em] sm:text-base"
          >
            {word}
            <Asterisk className="h-4 w-4 opacity-50" strokeWidth={2.5} />
          </span>
        ))}
      </div>
    </div>
  );
}
