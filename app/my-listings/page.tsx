import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Protected } from "@/components/protected";
import { MyListingsClient } from "@/components/my/my-listings-client";

export const metadata: Metadata = {
  title: "My studio listings",
  description: "Manage the studios you host on StudioSpace.",
};

export default function MyListingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Host dashboard"
        title="Your rooms, at a glance."
        description="Update details, adjust pricing or take a listing down. Everything you host lives here."
      />
      <div className="container-x py-10 sm:py-12">
        <Protected>
          <MyListingsClient />
        </Protected>
      </div>
    </>
  );
}
