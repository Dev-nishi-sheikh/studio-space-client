/**
 * Lightweight session flag shared by the browser and the route guard.
 *
 * The real credential stays where it belongs:
 * - demo mode  → the session record in localStorage (see `demo-store.ts`)
 * - live mode  → the HTTPOnly JWT cookie set by the Express API
 *
 * This flag only tells the middleware that the browser *had* a session, so
 * private routes can redirect before the client-side `Protected` guard boots.
 * It is not trusted for authorization — the API and the client provider still
 * validate the session on every request.
 */
export const SESSION_COOKIE = "ss_session";

/** 30 days, matching the demo session lifetime. */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function setSessionCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${SESSION_COOKIE}=1; Path=/; Max-Age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax${
    window.location.protocol === "https:" ? "; Secure" : ""
  }`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
