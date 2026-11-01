import type { NextRequest } from "next/server";
import { guardRequest } from "@/lib/route-guard";

/**
 * Next.js 16 entry point (the `proxy.ts` convention that replaces
 * `middleware.ts`). Kept in sync with `middleware.ts`, which is the entry
 * point Next.js 15 picks up.
 */
export function proxy(request: NextRequest) {
  return guardRequest(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/wishlist/:path*",
    "/invoice/:path*",
    "/studios/edit/:path*",
  ],
};
