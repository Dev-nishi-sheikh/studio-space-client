"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Send } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { SOCIAL_ICONS } from "@/components/icons";
import { POPULAR_CATEGORIES, SOCIAL_LINKS } from "@/lib/constants";
import { isEmail } from "@/lib/utils";

const quickLinks = [
  { href: "/studios", label: "Explore studios" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About StudioSpace" },
  { href: "/add-studio", label: "List your space" },
  { href: "/my-bookings", label: "My bookings" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmail(email.trim())) {
      toast.error("Enter a valid email address", {
        description: "We only send studio openings and production notes — no noise.",
      });
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setEmail("");
      toast.success("You're on the list", {
        description: "New spaces and host notes will land in your inbox each month.",
      });
    }, 550);
  }

  return (
    <footer className="print-hidden relative overflow-hidden border-t border-border bg-surface">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-accent/8 blur-3xl" />
      <div className="container-x relative py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              A peer-to-peer marketplace for the rooms where creative work actually gets made.
              Find the right light, the right quiet, the right stage — and book it directly with
              the people who built it.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-muted">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-muted">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {POPULAR_CATEGORIES.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              Good rooms, once a month.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Get new listings, host tips and production notes. We keep it short.
            </p>
            <form onSubmit={subscribe} className="mt-4">
              <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1.5 pl-4 focus-within:border-accent">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  aria-label="Email for newsletter"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted">
              Hosting a space?
              <Link href="/add-studio" className="text-link text-xs">
                Turn it into a set
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} StudioSpace. Every room has a story.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms &amp; conditions
            </Link>
            <Link href="/terms#privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
            <span>Built for creators, by creators.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
