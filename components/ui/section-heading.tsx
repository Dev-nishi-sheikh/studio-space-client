import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        actionLabel && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="display-section mt-4">{title}</h2>
        {description && (
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="text-link shrink-0 text-sm">
          {actionLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
