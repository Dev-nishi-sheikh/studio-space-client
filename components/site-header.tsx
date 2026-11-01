"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Building2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_LINKS } from "@/lib/constants";
import { buttonClass } from "@/lib/ui";
import { cn, initials } from "@/lib/utils";

const accountLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/add-studio", icon: PlusCircle },
  { label: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/studios") return pathname.startsWith("/studios");
    return pathname === href;
  };

  async function handleLogout() {
    setAccountOpen(false);
    setMenuOpen(false);
    await logout();
    toast.success("You're signed out", { description: "Come back when the next idea lands." });
    router.push("/");
  }

  return (
    <header className="print-hidden sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-[0.82rem] font-bold transition-colors",
                isActive(link.href)
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-[1px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:grid" />

          {!loading && !user && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className={buttonClass({ variant: "ghost", size: "sm", className: "px-4" })}
              >
                Log in
              </Link>
              <Link href="/register" className={buttonClass({ size: "sm" })}>
                Join StudioSpace
              </Link>
            </div>
          )}

          {user && (
            <div ref={accountRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3 transition-colors hover:bg-surface-2"
              >
                <span className="relative grid h-8 w-8 overflow-hidden rounded-full bg-surface-2">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-[0.7rem] font-bold">
                      {initials(user.name)}
                    </span>
                  )}
                </span>
                <span className="max-w-[8.5rem] truncate text-xs font-bold">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted transition-transform",
                    accountOpen && "rotate-180",
                  )}
                />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.65)]"
                >
                  <div className="border-b border-border px-3 pb-3 pt-2">
                    <p className="truncate text-sm font-bold">{user.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <div className="py-1.5">
                    {accountLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                      >
                        <item.icon className="h-4 w-4" strokeWidth={1.8} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl border-t border-border px-3 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.8} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto border-t border-border bg-background px-5 py-6 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between border-b border-border/70 py-4 font-display text-2xl font-medium tracking-tight",
                  isActive(link.href) && "text-accent",
                )}
              >
                <span>{link.label}</span>
                <span className="font-sans text-[0.65rem] font-bold tracking-[0.2em] text-muted">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </div>

          {user ? (
            <div className="mt-6">
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                <span className="grid h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-2">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.name}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-xs font-bold">
                      {initials(user.name)}
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{user.name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {accountLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-xs font-bold"
                  >
                    <item.icon className="h-4 w-4 text-accent" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={handleLogout}
                  className={buttonClass({ variant: "outline", size: "sm", className: "gap-2" })}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/login" className={buttonClass({ variant: "outline", size: "lg" })}>
                Log in
              </Link>
              <Link href="/register" className={buttonClass({ size: "lg" })}>
                Create an account
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted">Prefer it lighter?</span>
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
