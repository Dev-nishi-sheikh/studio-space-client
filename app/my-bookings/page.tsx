import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Protected } from "@/components/protected";
import { MyBookingsClient } from "@/components/my/my-bookings-client";

export const metadata: Metadata = {
  title: "My bookings",
  description: "Track reservations, check statuses and cancel pending StudioSpace bookings.",
};

export default function MyBookingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Your call sheet"
        title="Every shoot, one list."
        description="Pending requests, confirmed sessions and completed shoots — with invoices when you need them."
      />
      <div className="container-x py-10 sm:py-12">
        <Protected>
          <MyBookingsClient />
        </Protected>
      </div>
    </>
  );
}
