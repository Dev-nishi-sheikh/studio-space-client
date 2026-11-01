import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border", className)}>
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-accent/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-lime/10 blur-3xl" />
      <div className="container-x relative py-14 sm:py-20">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display-page mt-4 max-w-4xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-muted">{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
