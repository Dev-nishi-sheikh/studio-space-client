import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./session-cookie";

/**
 * Routes that require a signed-in user. Keep this list in sync with the
 * `Protected` wrappers in `app/` and the matcher in `middleware.ts`/`proxy.ts`.
 */
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/add-studio",
  "/my-listings",
  "/my-bookings",
  "/wishlist",
  "/invoice",
  "/studios/edit",
] as const;

/** Next.js matcher entries for the guard (shared by middleware.ts and proxy.ts). */
export const PROTECTED_MATCHERS = [
  "/dashboard/:path*",
  "/add-studio/:path*",
  "/my-listings/:path*",
  "/my-bookings/:path*",
  "/wishlist/:path*",
  "/invoice/:path*",
  "/studios/edit/:path*",
];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Redirects unauthenticated visitors away from private routes, preserving the
 * original destination in `?redirect=`. Returns `NextResponse.next()` otherwise.
 */
export function guardRequest(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedPath(pathname)) return NextResponse.next();
  if (request.cookies.get(SESSION_COOKIE)?.value) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("redirect", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}
