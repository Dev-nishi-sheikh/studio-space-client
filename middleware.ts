import type { NextRequest } from "next/server";
import { guardRequest } from "@/lib/route-guard";

/**
 * Next.js 15 middleware entry point. `proxy.ts` holds the identical handler
 * for Next.js 16, where `middleware.ts` was renamed to `proxy.ts`.
 */
export function middleware(request: NextRequest) {
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
