import { cn } from "./utils";

type Variant = "primary" | "outline" | "ghost" | "dark" | "lime" | "danger" | "soft";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-[0_10px_25px_-14px_rgba(240,76,35,0.9)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0",
  outline:
    "border border-border bg-transparent text-foreground hover:border-foreground/35 hover:bg-surface-2",
  ghost: "bg-transparent text-foreground hover:bg-surface-2",
  dark: "bg-foreground text-background hover:-translate-y-0.5 hover:opacity-90",
  lime: "bg-lime text-lime-foreground hover:-translate-y-0.5 hover:brightness-105",
  danger: "bg-red-600 text-white hover:bg-red-700",
  soft: "bg-surface-2 text-foreground hover:bg-border",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
  icon: "h-11 w-11 p-0",
  "icon-sm": "h-9 w-9 p-0",
};

export function buttonClass(options?: { variant?: Variant; size?: Size; className?: string }) {
  const { variant = "primary", size = "md", className } = options ?? {};
  return cn(base, variants[variant], sizes[size], className);
}

export function badgeClass(tone: "accent" | "neutral" | "lime" | "danger" | "warning" | "success" | "info", className?: string) {
  const tones: Record<typeof tone, string> = {
    accent: "bg-accent/12 text-accent border-accent/25",
    neutral: "bg-surface-2 text-muted border-border",
    lime: "bg-lime/20 text-lime-foreground border-lime/35 dark:text-lime",
    danger: "bg-red-500/12 text-red-600 border-red-500/25 dark:text-red-400",
    warning: "bg-amber-500/14 text-amber-700 border-amber-500/30 dark:text-amber-300",
    success: "bg-emerald-500/14 text-emerald-700 border-emerald-500/30 dark:text-emerald-300",
    info: "bg-sky-500/14 text-sky-700 border-sky-500/30 dark:text-sky-300",
  };
  return cn(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]",
    tones[tone],
    className,
  );
}

export const inputClass =
  "field";

export const cardClass = "surface-card";
