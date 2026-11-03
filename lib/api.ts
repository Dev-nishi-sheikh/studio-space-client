import * as demo from "./demo-store";
import { authClient } from "./auth-client";
import type {
  Booking,
  BookingDraft,
  LoginInput,
  RegisterInput,
  Studio,
  StudioDraft,
  StudioQuery,
  User,
} from "./types";

const rawBase = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "");
const forceDemo = (process.env.NEXT_PUBLIC_DEMO_MODE ?? "").toLowerCase() === "true";

export const API_BASE_URL = rawBase;
export const isDemoMode = !rawBase || forceDemo;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      "We couldn't reach the StudioSpace server. Check your connection and try again.",
      503,
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      "Something went wrong. Please try again.";
    throw new ApiError(String(message), response.status);
  }

  return data as T;
}

function unwrap<T>(payload: unknown, key?: string): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (key && inner && typeof inner === "object" && key in inner) {
      return (inner as Record<string, unknown>)[key] as T;
    }
    return inner as T;
  }
  if (key && payload && typeof payload === "object" && key in payload) {
    return (payload as Record<string, unknown>)[key] as T;
  }
  return payload as T;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function toStringValue(value: unknown, fallback = ""): string {
  return value === undefined || value === null ? fallback : String(value);
}

/** The API serialises Mongo documents with `id` (not `_id`) and `imageURL`. */
function normaliseStudio(record: unknown): Studio {
  const studio = asRecord(record) ?? {};
  const owner = asRecord(studio.owner);

  return {
    ...(studio as unknown as Studio),
    _id: String(studio._id ?? studio.id ?? ""),
    image: String(studio.image ?? studio.imageURL ?? ""),
    ownerName: toStringValue(studio.ownerName ?? owner?.name, "Studio host"),
    ownerEmail: toStringValue(studio.ownerEmail ?? owner?.email),
    ownerAvatar: toStringValue(studio.ownerAvatar ?? studio.ownerPhoto ?? owner?.photoURL),
    gallery: Array.isArray(studio.gallery) ? (studio.gallery as string[]) : [],
    amenities: Array.isArray(studio.amenities) ? (studio.amenities as string[]) : [],
    rating: Number(studio.rating ?? 0),
    reviewCount: Number(studio.reviewCount ?? 0),
    createdAt: toStringValue(studio.createdAt, new Date().toISOString()),
  };
}

function toUser(payload: unknown): User | null {
  const user = asRecord(payload);
  if (!user) return null;
  const id = user._id ?? user.id;
  if (!id || !user.email) return null;

  return {
    _id: String(id),
    name: toStringValue(user.name),
    email: toStringValue(user.email),
    photoURL: toStringValue(user.photoURL ?? user.image),
    createdAt: user.createdAt ? String(user.createdAt) : undefined,
  };
}

/** Shape accepted by POST /studios and PATCH /studios/:id. */
function toStudioPayload(draft: StudioDraft) {
  return {
    title: draft.title,
    category: draft.category,
    hourlyRate: draft.hourlyRate,
    securityDeposit: draft.securityDeposit,
    capacity: draft.capacity,
    location: draft.location,
    imageURL: draft.image,
    gallery: draft.gallery,
    amenities: draft.amenities,
    overview: draft.overview,
  };
}

/** Map a server booking document onto the client-facing `Booking` shape. */
function toBooking(record: unknown): Booking {
  const booking = asRecord(record) ?? {};
  const studio = asRecord(booking.studio);
  const hours = Number(booking.hours ?? 0);
  const subtotal = Number(booking.subtotal ?? 0);
  const deposit = Number(booking.deposit ?? booking.securityDeposit ?? 0);

  return {
    ...(booking as unknown as Booking),
    _id: String(booking._id ?? booking.id ?? ""),
    studioId: String(booking.studioId ?? studio?.id ?? studio?._id ?? booking.studio ?? ""),
    studioTitle: toStringValue(
      booking.studioTitle ?? studio?.title,
      "Studio booking",
    ),
    studioImage: toStringValue(
      booking.studioImage ?? studio?.imageURL ?? studio?.image,
    ),
    studioCategory: (booking.studioCategory ??
      studio?.category ??
      "Photo Studio") as Booking["studioCategory"],
    ownerEmail: toStringValue(booking.ownerEmail ?? booking.hostEmail ?? studio?.ownerEmail),
    ownerName: toStringValue(
      booking.ownerName ?? booking.hostName ?? studio?.ownerName,
      "Studio host",
    ),
    userEmail: toStringValue(booking.userEmail),
    userName: toStringValue(booking.userName),
    date: toStringValue(booking.date ?? booking.bookingDate),
    startTime: toStringValue(booking.startTime),
    endTime: toStringValue(booking.endTime),
    guests: Number(booking.guests ?? 0),
    hours,
    subtotal,
    deposit,
    total: Number(booking.total ?? booking.totalPrice ?? subtotal + deposit),
    status: (booking.status ?? "Pending") as Booking["status"],
    note: typeof booking.note === "string" && booking.note ? booking.note : undefined,
    createdAt: toStringValue(booking.createdAt, new Date().toISOString()),
  };
}

function toStudios(payload: unknown): Studio[] {
  const value = unwrap<unknown>(payload, "studios");
  const records = Array.isArray(value)
    ? value
    : value && typeof value === "object" && "studios" in value
      ? (value as { studios: unknown[] }).studios ?? []
      : [];

  return records.map(normaliseStudio);
}

function toStudio(payload: unknown): Studio {
  return normaliseStudio(payload);
}

function wishlistIds(payload: unknown): string[] {
  const value = unwrap<unknown>(payload, "studioIds");
  const records = Array.isArray(value) ? value : [];

  return records
    .map((item) => {
      if (typeof item === "string") return item;
      const record = asRecord(item);
      return record ? String(record.id ?? record._id ?? "") : "";
    })
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function getSession(): Promise<User | null> {
  if (isDemoMode) return demo.demoGetSession();
  try {
    const payload = await request<unknown>("/auth/me");
    return toUser(unwrap<unknown>(payload, "user"));
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) return null;
    throw error;
  }
}

export async function login(input: LoginInput): Promise<User> {
  if (isDemoMode) return demo.demoLogin(input);
  const payload = await request<unknown>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const user = toUser(unwrap<unknown>(payload, "user"));
  if (!user) throw new ApiError("The server didn't return your account details.", 500);
  return user;
}

export async function register(input: RegisterInput): Promise<User> {
  if (isDemoMode) return demo.demoRegister(input);
  const payload = await request<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const user = toUser(unwrap<unknown>(payload, "user"));
  if (!user) throw new ApiError("The server didn't return your account details.", 500);
  return user;
}

export async function googleLogin(callbackURL?: string): Promise<User | null> {
  if (isDemoMode) return demo.demoGoogleLogin();

  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: callbackURL ?? window.location.origin,
  });
  if (error) throw new ApiError(error.message ?? "Google sign-in failed", 400);
  return null;
}

export async function logout(): Promise<void> {
  if (isDemoMode) return demo.demoLogout();
  try {
    await authClient.signOut();
  } catch {
    // Better Auth may not have a social session; the custom JWT cookie still
    // needs clearing below.
  }
  await request<unknown>("/auth/logout", { method: "POST" });
}

/* ------------------------------------------------------------------ */
/* Studios                                                             */
/* ------------------------------------------------------------------ */

function toQueryString(query: StudioQuery) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.maxPrice) params.set("maxPrice", String(query.maxPrice));
  if (query.sort) params.set("sort", query.sort);
  const value = params.toString();
  return value ? `?${value}` : "";
}

export async function getStudios(query: StudioQuery = {}): Promise<Studio[]> {
  if (isDemoMode) return demo.demoGetStudios(query);
  return toStudios(await request<unknown>(`/studios${toQueryString(query)}`));
}

export async function getFeaturedStudios(limit = 6): Promise<Studio[]> {
  if (isDemoMode) return demo.demoGetFeaturedStudios(limit);
  const payload = await request<unknown>(`/studios/featured?limit=${limit}`);
  return toStudios(payload).slice(0, limit);
}

export async function getStudio(id: string): Promise<Studio | null> {
  if (isDemoMode) return demo.demoGetStudio(id);
  try {
    const payload = await request<unknown>(`/studios/${id}`);
    const studio = unwrap<Studio>(payload, "studio");
    return studio ? toStudio(studio) : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getMyListings(email: string): Promise<Studio[]> {
  if (isDemoMode) return demo.demoGetMyListings(email);
  return toStudios(await request<unknown>("/studios/mine"));
}

export async function createStudio(draft: StudioDraft, user: User): Promise<Studio> {
  if (isDemoMode) return demo.demoCreateStudio(draft, user);
  const payload = await request<unknown>("/studios", {
    method: "POST",
    body: JSON.stringify(toStudioPayload(draft)),
  });
  return toStudio(unwrap<Studio>(payload, "studio"));
}

export async function updateStudio(
  id: string,
  draft: StudioDraft,
  user: User,
): Promise<Studio> {
  if (isDemoMode) return demo.demoUpdateStudio(id, draft, user);
  const payload = await request<unknown>(`/studios/${id}`, {
    method: "PATCH",
    body: JSON.stringify(toStudioPayload(draft)),
  });
  return toStudio(unwrap<Studio>(payload, "studio"));
}

export async function deleteStudio(id: string, user: User): Promise<void> {
  if (isDemoMode) return demo.demoDeleteStudio(id, user);
  await request<unknown>(`/studios/${id}`, { method: "DELETE" });
}

/* ------------------------------------------------------------------ */
/* Bookings                                                            */
/* ------------------------------------------------------------------ */

export async function getMyBookings(email: string): Promise<Booking[]> {
  if (isDemoMode) return demo.demoGetMyBookings(email);
  const payload = await request<unknown>("/bookings/mine");
  const value = unwrap<unknown>(payload, "bookings");
  return (Array.isArray(value) ? value : []).map(toBooking);
}

export async function getBooking(id: string): Promise<Booking | null> {
  if (isDemoMode) return demo.demoGetBooking(id);
  try {
    const payload = await request<unknown>(`/bookings/${id}`);
    const booking = unwrap<unknown>(payload, "booking");
    return booking ? toBooking(booking) : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function createBooking(
  draft: BookingDraft,
  user: User,
): Promise<Booking> {
  if (isDemoMode) return demo.demoCreateBooking(draft, user);
  const payload = await request<unknown>("/bookings", {
    method: "POST",
    body: JSON.stringify({
      studioId: draft.studioId,
      bookingDate: draft.date,
      startTime: draft.startTime,
      endTime: draft.endTime,
      note: draft.note ?? "",
    }),
  });
  return toBooking(unwrap<unknown>(payload, "booking"));
}

export async function cancelBooking(id: string, user: User): Promise<Booking> {
  if (isDemoMode) return demo.demoCancelBooking(id, user);
  const payload = await request<unknown>(`/bookings/${id}/cancel`, {
    method: "PATCH",
  });
  return toBooking(unwrap<unknown>(payload, "booking"));
}

export async function getBookedSlots(studioId: string, date: string) {
  if (isDemoMode) return demo.demoGetBookedSlots(studioId, date);
  const payload = await request<unknown>(
    `/bookings/availability?studioId=${encodeURIComponent(studioId)}&date=${encodeURIComponent(date)}`,
  );
  const blocked = unwrap<unknown>(payload, "blockedSlots");
  const slots = Array.isArray(blocked) ? blocked : [];
  return slots.map((slot) => {
    const record = asRecord(slot) ?? {};
    return {
      startTime: toStringValue(record.startTime),
      endTime: toStringValue(record.endTime),
      status: "Confirmed" as const,
    };
  });
}

/* ------------------------------------------------------------------ */
/* Wishlist                                                            */
/* ------------------------------------------------------------------ */

export async function getWishlist(email: string): Promise<string[]> {
  if (isDemoMode) return demo.demoGetWishlist(email);
  const payload = await request<unknown>("/wishlist");
  return wishlistIds(payload);
}

export async function toggleWishlist(
  email: string,
  studioId: string,
): Promise<string[]> {
  if (isDemoMode) return demo.demoToggleWishlist(email, studioId);
  await request<unknown>(`/wishlist/${studioId}/toggle`, { method: "POST" });
  return getWishlist(email);
}

export function getGoogleAuthUrl() {
  return isDemoMode ? null : `${API_BASE_URL}/auth/google`;
}
