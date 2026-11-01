import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Protected } from "@/components/protected";
import { DashboardClient } from "@/components/my/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your StudioSpace listings, bookings and saved spaces in one view.",
};

export default function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Dashboard"
        title="Your studio, in one view."
        description="Listings, upcoming shoots and saved spaces — with the next action always a click away."
      />
      <div className="container-x py-10 sm:py-12">
        <Protected>
          <DashboardClient />
        </Protected>
      </div>
    </>
  );
}
