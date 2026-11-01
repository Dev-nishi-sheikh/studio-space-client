import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { buttonClass } from "@/lib/ui";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-border bg-surface px-6 py-16 text-center sm:px-12">
      <div className="absolute inset-x-0 top-0 mx-auto h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl border border-border bg-background text-accent">
          <Icon className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h3 className="mt-6 font-display text-2xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && actionHref && (
            <Link href={actionHref} className={buttonClass({ size: "md" })}>
              {actionLabel}
            </Link>
          )}
          {actionLabel && onAction && (
            <button type="button" onClick={onAction} className={buttonClass({ size: "md" })}>
              {actionLabel}
            </button>
          )}
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className={buttonClass({ variant: "outline", size: "md" })}
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
