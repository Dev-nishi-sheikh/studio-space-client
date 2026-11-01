import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Protected } from "@/components/protected";
import { WishlistClient } from "@/components/my/wishlist-client";

export const metadata: Metadata = {
  title: "Saved studios",
  description: "Your private shortlist of creative spaces saved on StudioSpace.",
};

export default function WishlistPage() {
  return (
    <>
      <PageHero
        eyebrow="Saved spaces"
        title="Keep the good rooms close."
        description="A private shortlist for the shoots you're still shaping. Save a space now, book it when the dates land."
      />
      <div className="container-x py-10 sm:py-12">
        <Protected>
          <WishlistClient />
        </Protected>
      </div>
    </>
  );
}
