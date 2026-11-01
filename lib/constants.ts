import { IMAGES } from "./images";
import type { Category } from "./types";

export interface CategoryMeta {
  name: Category;
  label: string;
  slug: string;
  blurb: string;
  image: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    name: "Photo Studio",
    label: "Photo Studios",
    slug: "photo-studio",
    blurb: "Daylight lofts, cyc walls and full lighting kits.",
    image: IMAGES.photoLights,
  },
  {
    name: "Film Stage",
    label: "Sound Stages",
    slug: "film-stage",
    blurb: "Blackout stages, loading docks and rigging points.",
    image: IMAGES.filmStage,
  },
  {
    name: "Podcast Lounge",
    label: "Podcast Rooms",
    slug: "podcast-lounge",
    blurb: "Treat rooms, broadcast mics and a calm corner.",
    image: IMAGES.podcast,
  },
  {
    name: "Music Suite",
    label: "Music Suites",
    slug: "music-suite",
    blurb: "Tracking rooms, consoles and a tuned vocal booth.",
    image: IMAGES.music,
  },
  {
    name: "Workshop",
    label: "Art Workshops",
    slug: "workshop",
    blurb: "Wet rooms, maker benches and room to get messy.",
    image: IMAGES.artStudio,
  },
];

export const CATEGORY_NAMES: Category[] = CATEGORIES.map((c) => c.name);

export const AMENITIES = [
  "Natural light",
  "Blackout curtains",
  "Cyc wall",
  "Lighting kit",
  "Backdrops",
  "Soundproofing",
  "PA system",
  "Mixing console",
  "Instruments",
  "Podcast mics",
  "Green room",
  "Makeup room",
  "Wi-Fi",
  "Parking",
  "Loading dock",
  "Freight elevator",
  "Air conditioning",
  "Kitchen",
  "Seating lounge",
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

export const TIME_SLOTS = Array.from({ length: 33 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

export const DEMO_ACCOUNTS = {
  host: { email: "harry@studiospace.com", password: "Studio123", label: "Host demo" },
  guest: { email: "mia@studiospace.com", password: "Studio123", label: "Creator demo" },
};

export const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export const POPULAR_CATEGORIES = CATEGORIES.map((c) => ({
  label: c.label,
  href: `/studios?category=${encodeURIComponent(c.name)}`,
}));
