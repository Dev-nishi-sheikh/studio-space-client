import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "StudioSpace — Book creative studios by the hour",
    template: "%s · StudioSpace",
  },
  description:
    "StudioSpace is a peer-to-peer marketplace for photo studios, sound stages, podcast rooms, music suites and workshops. Discover the right room, check availability and book it directly with the host.",
  keywords: [
    "studio rental",
    "photo studio",
    "sound stage",
    "podcast studio",
    "music studio",
    "creative workspace",
    "StudioSpace",
  ],
  openGraph: {
    title: "StudioSpace — Book creative studios by the hour",
    description:
      "A peer-to-peer marketplace for the rooms where creative work gets made. Find your next set.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 800,
        alt: "A daylight photo studio with a cyc wall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioSpace — Book creative studios by the hour",
    description: "Find the right light, the right quiet, the right stage.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <body>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-bold focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content" className="min-h-[60vh]">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
