# StudioSpace — Peer-to-Peer Creative Studio Marketplace

**Live site:** _Pending deployment — replace this line with your Vercel URL after importing the repo (see [Deployment](#-deployment))._

StudioSpace is a peer-to-peer marketplace for photo studios, sound stages, podcast lounges, music suites and art workshops. Creators discover a room, check the details and live availability, then reserve it by the hour. Hosts list their spaces, manage listings and keep the booking calendar on their own terms.

> Built as the client-side application for Assignment 8. The app ships with a complete **demo mode** so every flow (auth, listings, bookings, wishlist) works before the Express/MongoDB API is connected.

---

## ✨ What you can do

- **Discover with a cinematic home page** — Swiper-powered hero slider, six dynamic featured studios fetched with a limit, five browsable categories, a four-step booking explainer and a host-guarantee section.
- **Search and filter the directory** — keyword search, category chips, price ceiling, sorting and URL-based category preselection, with branded skeleton loaders and a friendly empty state.
- **Book a real room in a modal** — pick a date and time window, see the hourly math and refundable deposit update live, and submit a reservation that starts as **Pending**.
- **Host your own space** — full add/edit forms with cover-image upload (imgbb when configured), gallery URLs, amenity checkboxes, live card preview and read-only host details.
- **Manage everything from a dashboard** — My Studio Listings with a delete confirmation modal, My Bookings with status badges, cancel flow and printable/PDF invoices for confirmed bookings.
- **Save a shortlist** — heart any studio card to add it to a MongoDB-backed wishlist (localStorage-backed in demo mode).
- **Work in light or dark** — persistent theme toggle covering every surface, illustration and print-friendly invoice.
- **Friendly failure states** — custom 404, route-level skeletons, toasts for every action, inline form validation and no browser `alert()` anywhere.

---

## 🧱 Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, custom design tokens |
| UI primitives | Custom components, lucide-react |
| Slider | Swiper.js 14 |
| Notifications | Sonner |
| Theme | next-themes (class strategy) |
| Auth (client) | Auth context + HTTPOnly-cookie API calls; demo session fallback |
| Images | Unsplash + imgbb upload endpoint |
| API | Express + MongoDB (separate repository, see API contract below) |
| Deployment | Vercel (recommended) |

---

## 🚀 Run it locally

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template
cp .env.example .env.local

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```env
# Leave empty to use the built-in demo data (recommended for a quick look).
NEXT_PUBLIC_API_URL=

# Optional — enables real image uploads through imgbb.
NEXT_PUBLIC_IMGBB_API_KEY=

# Optional — force demo mode even if an API URL exists.
NEXT_PUBLIC_DEMO_MODE=
```

- **No `NEXT_PUBLIC_API_URL`** → demo mode. Seed listings, users, bookings and wishlists persist in `localStorage`, including double-booking prevention and password rules.
- **Set `NEXT_PUBLIC_API_URL`** (for example `http://localhost:5000/api`) → the app calls the Express/MongoDB server with `credentials: "include"` so JWTs travel in HTTPOnly cookies.

Production build:

```bash
npm run build
npm start
```

---

## 🔑 Examiner test credentials

These accounts are seeded in the MongoDB database used by the deployed API:

| Role | Email | Password |
| --- | --- | --- |
| Host — owns listings and receives bookings | `ayesha@studiospace.com` | `Studio123` |
| Creator — has demo bookings and a wishlist | `demo@studiospace.com` | `Studio123` |

Additional seeded accounts you can sign in with: `marcus@studiospace.com` and `nadia@studiospace.com` (same password).

If you run the app **without** `NEXT_PUBLIC_API_URL` (local demo mode), use the demo-mode accounts instead: `harry@studiospace.com` (host) and `mia@studiospace.com` (creator), both `Studio123`.

Registration is available at `/register`; passwords require an uppercase letter, a lowercase letter and at least 6 characters.

---

## 🗺️ Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero slider, featured studios, categories, how it works, host guarantee |
| `/studios` | Public | Search, filter and sort the directory |
| `/studios/[id]` | Public | Gallery, specs, amenities, reviews, host card, booking modal |
| `/studios/edit/[id]` | Private | Pre-filled edit form (owner only) |
| `/add-studio` | Private | Create a listing with image upload |
| `/my-listings` | Private | Owner's listings with update/delete |
| `/my-bookings` | Private | Reservations, statuses, cancel flow, invoice links |
| `/wishlist` | Private | Saved studios |
| `/dashboard` | Private | Listings, upcoming shoots, saved spaces, spend |
| `/invoice/[id]` | Private | Printable booking invoice / save-as-PDF |
| `/login`, `/register` | Public | Auth with Google option and validation |
| `/about`, `/how-it-works`, `/terms` | Public | Story, booking guide and terms/privacy |
| `*` | Public | Custom studio-themed 404 |

Private routes are guarded by a client auth provider; refreshing a private route while logged in keeps you on the page.

---

## 🔌 API contract (Express server)

The client calls these endpoints when `NEXT_PUBLIC_API_URL` is present. All requests include cookies.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | Set HTTPOnly JWT cookie |
| `POST` | `/auth/register` | Create account |
| `GET` | `/auth/me` | Current user |
| `POST` | `/auth/logout` | Clear session |
| `GET` | `/auth/google` | Google OAuth entry point |
| `GET` | `/studios` | List/filter (`search`, `category`, `maxPrice`, `sort`) |
| `GET` | `/studios/featured?limit=6` | Top-rated studios for the home page |
| `GET` | `/studios/:id` | Studio details |
| `GET` | `/studios/mine` | Listings owned by the signed-in user |
| `POST` | `/studios` | Create listing (protected, HTTPOnly cookie) |
| `PATCH` | `/studios/:id` | Update listing (protected) |
| `DELETE` | `/studios/:id` | Delete listing (protected) |
| `POST` | `/bookings` | Create booking, status `Pending` (protected) |
| `GET` | `/bookings/mine` | Current user's bookings |
| `GET` | `/bookings/:id` | Single booking for invoice |
| `GET` | `/bookings/availability?studioId=&date=` | Confirmed windows that block a date |
| `PATCH` | `/bookings/:id/cancel` | Cancel a pending booking |
| `GET` | `/wishlist` | Saved studios for the signed-in user |
| `POST` | `/wishlist/:studioId/toggle` | Save or remove a studio |

The bundled demo implements the same behaviour locally, including the confirmed-booking overlap check used by Challenge 2.

---

## 🎨 Design notes

- Warm paper light theme and near-black cinema dark theme, with vermilion and acid-lime accents.
- Bricolage Grotesque for display type, Manrope for body copy; one consistent heading scale across every page.
- Equal-height studio cards, uniform 4:3 imagery, a shared pill button system and a sticky navbar with active-route indicators.
- Responsive from 320px upward: slide-out mobile navigation, horizontal snap galleries and stacking form sections.
- The X (formerly Twitter) logo is used in the footer alongside Instagram, YouTube and LinkedIn.
- Print styles hide the site chrome and force the invoice to a clean white sheet.

---

## 📁 Project structure

```text
app/                  App Router pages, loading/error/not-found states
components/
  auth/               Login and register forms
  home/               Hero slider, featured studios, categories, guarantees
  studios/            Cards, details, booking modal, create/edit form
  my/                 Dashboard, listings, bookings, wishlist
  ui/                 Modal, skeletons, empty states, badges, headings
lib/
  api.ts              API facade with demo/live switch
  demo-store.ts       LocalStorage-backed demo implementation
  demo-seed.ts        Twelve seeded studios, users, bookings and wishlist data
  constants.ts        Categories, amenities, time slots, demo accounts
  images.ts           Curated Unsplash image set
```

---

## ☁️ Deployment

1. Push the client repository to GitHub.
2. Import it into Vercel.
3. Add `NEXT_PUBLIC_API_URL` (your Render/Express API URL) if you have deployed the server. Leave it blank to run the demo.
4. Deploy, then update the **Live site** link at the top of this README.

Every route is safe to reload directly — dynamic studio and invoice pages are server-rendered on demand, and the 404 page handles unknown paths.
