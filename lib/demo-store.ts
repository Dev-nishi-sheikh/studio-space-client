import {
  SEED_BOOKINGS,
  SEED_STUDIOS,
  SEED_USERS,
  SEED_WISHLIST,
  type DemoUser,
} from "./demo-seed";
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
import { hoursBetween, sleep, sortByRecommended, todayISO } from "./utils";

const PREFIX = "studiospace.v1.";
const KEYS = {
  seeded: "seeded",
  studios: "studios",
  users: "users",
  bookings: "bookings",
  wishlist: "wishlist",
  session: "session",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // A browser with storage disabled still gets a working, non-persistent session.
  }
}

function ensureSeeded() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(PREFIX + KEYS.seeded) === "1") return;
  write(KEYS.studios, SEED_STUDIOS);
  write(KEYS.users, SEED_USERS);
  write(KEYS.bookings, SEED_BOOKINGS);
  write(KEYS.wishlist, SEED_WISHLIST);
  window.localStorage.setItem(PREFIX + KEYS.seeded, "1");
}

function sanitizeUser(user: DemoUser): User {
  const { password: _password, ...safe } = user;
  return safe;
}

function users() {
  ensureSeeded();
  return read<DemoUser[]>(KEYS.users, SEED_USERS);
}

function studios() {
  ensureSeeded();
  return read<Studio[]>(KEYS.studios, SEED_STUDIOS);
}

function bookings() {
  ensureSeeded();
  return read<Booking[]>(KEYS.bookings, SEED_BOOKINGS);
}

function wishlistStore() {
  ensureSeeded();
  return read<Record<string, string[]>>(KEYS.wishlist, SEED_WISHLIST);
}

export async function demoGetStudios(query: StudioQuery = {}): Promise<Studio[]> {
  await sleep(320);
  let result = studios();
  const search = query.search?.trim().toLowerCase();

  if (search) {
    result = result.filter((studio) =>
      [studio.title, studio.location, studio.category, studio.overview]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }

  if (query.category) {
    result = result.filter((studio) => studio.category === query.category);
  }

  if (query.maxPrice) {
    result = result.filter((studio) => studio.hourlyRate <= Number(query.maxPrice));
  }

  switch (query.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.hourlyRate - a.hourlyRate);
      break;
    case "newest":
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "rating":
      result = [...result].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    default:
      result = sortByRecommended(result);
  }

  return result;
}

export async function demoGetFeaturedStudios(limit = 6): Promise<Studio[]> {
  await sleep(360);
  const listed = studios();
  const featured = listed.filter((studio) => studio.featured);
  const pool = featured.length >= limit ? featured : listed;
  return sortByRecommended(pool).slice(0, limit);
}

export async function demoGetStudio(id: string): Promise<Studio | null> {
  await sleep(260);
  return studios().find((studio) => studio._id === id) ?? null;
}

export async function demoGetMyListings(email: string): Promise<Studio[]> {
  await sleep(300);
  return studios()
    .filter((studio) => studio.ownerEmail === email)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function demoCreateStudio(draft: StudioDraft, user: User): Promise<Studio> {
  await sleep(550);
  const studio: Studio = {
    ...draft,
    _id: `st_${Date.now()}`,
    ownerEmail: user.email,
    ownerName: user.name,
    ownerAvatar: user.photoURL,
    rating: 5,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    featured: false,
  };
  write(KEYS.studios, [studio, ...studios()]);
  return studio;
}

export async function demoUpdateStudio(
  id: string,
  draft: StudioDraft,
  user: User,
): Promise<Studio> {
  await sleep(500);
  const all = studios();
  const index = all.findIndex((studio) => studio._id === id);
  if (index === -1) throw new Error("That studio could not be found.");
  if (all[index].ownerEmail !== user.email) {
    throw new Error("You can only edit studios that belong to your account.");
  }
  const updated: Studio = { ...all[index], ...draft };
  all[index] = updated;
  write(KEYS.studios, all);
  return updated;
}

export async function demoDeleteStudio(id: string, user: User): Promise<void> {
  await sleep(450);
  const all = studios();
  const target = all.find((studio) => studio._id === id);
  if (!target) throw new Error("That studio could not be found.");
  if (target.ownerEmail !== user.email) {
    throw new Error("You can only delete studios that belong to your account.");
  }
  write(
    KEYS.studios,
    all.filter((studio) => studio._id !== id),
  );
  write(
    KEYS.bookings,
    bookings().filter((booking) => booking.studioId !== id),
  );
  const lists = wishlistStore();
  Object.keys(lists).forEach((email) => {
    lists[email] = lists[email].filter((studioId) => studioId !== id);
  });
  write(KEYS.wishlist, lists);
}

export async function demoGetSession(): Promise<User | null> {
  ensureSeeded();
  const email = read<string | null>(KEYS.session, null);
  if (!email) return null;
  const user = users().find((item) => item.email === email);
  return user ? sanitizeUser(user) : null;
}

export async function demoLogin({ email, password }: LoginInput): Promise<User> {
  await sleep(650);
  ensureSeeded();
  const user = users().find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user || user.password !== password) {
    throw new Error("That email and password combination doesn't match our records.");
  }
  write(KEYS.session, user.email);
  return sanitizeUser(user);
}

export async function demoRegister(input: RegisterInput): Promise<User> {
  await sleep(700);
  ensureSeeded();
  const all = users();
  if (all.some((user) => user.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error("An account with that email already exists. Try logging in instead.");
  }
  const newUser: DemoUser = {
    _id: `usr_${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    photoURL:
      input.photoURL.trim() ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    password: input.password,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.users, [...all, newUser]);
  return sanitizeUser(newUser);
}

export async function demoGoogleLogin(): Promise<User> {
  await sleep(650);
  ensureSeeded();
  const googleEmail = "alex.rivera@gmail.com";
  const existing = users().find((user) => user.email === googleEmail);
  if (existing) {
    write(KEYS.session, existing.email);
    return sanitizeUser(existing);
  }
  const user: DemoUser = {
    _id: `usr_${Date.now()}`,
    name: "Alex Rivera",
    email: googleEmail,
    photoURL:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    password: `Google-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.users, [...users(), user]);
  write(KEYS.session, user.email);
  return sanitizeUser(user);
}

export async function demoLogout(): Promise<void> {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFIX + KEYS.session);
}

export async function demoGetMyBookings(email: string): Promise<Booking[]> {
  await sleep(300);
  return bookings()
    .filter((booking) => booking.userEmail === email)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function demoGetBooking(id: string): Promise<Booking | null> {
  await sleep(200);
  return bookings().find((booking) => booking._id === id) ?? null;
}

export async function demoCreateBooking(draft: BookingDraft, user: User): Promise<Booking> {
  await sleep(650);
  const studio = studios().find((item) => item._id === draft.studioId);
  if (!studio) throw new Error("That studio is no longer available.");

  const hours = hoursBetween(draft.startTime, draft.endTime);
  if (hours < 1) {
    throw new Error("Choose an end time that is later than your start time.");
  }
  if (draft.date < todayISO()) {
    throw new Error("Pick a booking date from today onwards.");
  }
  if (!Number.isInteger(draft.guests) || draft.guests < 1 || draft.guests > studio.capacity) {
    throw new Error(`Choose between 1 and ${studio.capacity} people for this studio.`);
  }
  if (studio.ownerEmail === user.email) {
    throw new Error("This is your own studio — you don't need to book it.");
  }

  const start = Number(draft.startTime.replace(":", ""));
  const end = Number(draft.endTime.replace(":", ""));

  const collision = bookings().find((booking) => {
    if (booking.studioId !== studio._id) return false;
    if (booking.status !== "Confirmed") return false;
    if (booking.date !== draft.date) return false;
    const otherStart = Number(booking.startTime.replace(":", ""));
    const otherEnd = Number(booking.endTime.replace(":", ""));
    return start < otherEnd && end > otherStart;
  });

  if (collision) {
    throw new Error(
      `Those hours overlap a confirmed booking (${collision.startTime}–${collision.endTime}). Please choose another window.`,
    );
  }

  const subtotal = Math.round(studio.hourlyRate * hours);
  const booking: Booking = {
    _id: `bk_${Date.now()}`,
    studioId: studio._id,
    studioTitle: studio.title,
    studioImage: studio.image,
    studioCategory: studio.category,
    ownerEmail: studio.ownerEmail,
    ownerName: studio.ownerName,
    userEmail: user.email,
    userName: user.name,
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    guests: draft.guests,
    hours,
    subtotal,
    deposit: studio.securityDeposit,
    total: subtotal + studio.securityDeposit,
    status: "Pending",
    note: draft.note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  write(KEYS.bookings, [booking, ...bookings()]);
  return booking;
}

export async function demoCancelBooking(id: string, user: User): Promise<Booking> {
  await sleep(450);
  const all = bookings();
  const index = all.findIndex((booking) => booking._id === id);
  if (index === -1) throw new Error("That booking could not be found.");
  if (all[index].userEmail !== user.email) {
    throw new Error("You can only cancel your own bookings.");
  }
  if (all[index].status !== "Pending") {
    throw new Error("Only pending bookings can be cancelled. Contact the host for help.");
  }
  const updated: Booking = { ...all[index], status: "Cancelled" };
  all[index] = updated;
  write(KEYS.bookings, all);
  return updated;
}

export async function demoGetBookedSlots(studioId: string, date: string) {
  await sleep(150);
  return bookings()
    .filter(
      (booking) =>
        booking.studioId === studioId &&
        booking.date === date &&
        (booking.status === "Confirmed" || booking.status === "Pending"),
    )
    .map((booking) => ({
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
    }));
}

export async function demoGetWishlist(email: string): Promise<string[]> {
  ensureSeeded();
  return wishlistStore()[email] ?? [];
}

export async function demoToggleWishlist(email: string, studioId: string): Promise<string[]> {
  ensureSeeded();
  const lists = wishlistStore();
  const current = lists[email] ?? [];
  const next = current.includes(studioId)
    ? current.filter((id) => id !== studioId)
    : [...current, studioId];
  lists[email] = next;
  write(KEYS.wishlist, lists);
  return next;
}

export function demoResetWorkspace() {
  if (typeof window === "undefined") return;
  [
    KEYS.seeded,
    KEYS.studios,
    KEYS.users,
    KEYS.bookings,
    KEYS.wishlist,
    KEYS.session,
  ].forEach((key) => window.localStorage.removeItem(PREFIX + key));
}
