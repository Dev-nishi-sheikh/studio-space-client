import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { ExploreClient } from "@/components/studios/explore-client";
import { BrandLoader } from "@/components/protected";

export const metadata: Metadata = {
  title: "Explore studios",
  description:
    "Browse photo studios, sound stages, podcast lounges, music suites and workshops available by the hour on StudioSpace.",
};

export default function StudiosPage() {
  return (
    <>
      <PageHero
        eyebrow="The studio directory"
        title={
          <>
            Find your
            <br />
            next set.
          </>
        }
        description="Real rooms, real hosts, real availability. Filter by what the production actually needs — then book the hours you need."
      />
      <Suspense fallback={<BrandLoader label="Setting up the directory…" />}>
        <ExploreClient />
      </Suspense>
    </>
  );
}
