import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Protected } from "@/components/protected";
import { StudioForm } from "@/components/studios/studio-form";

export const metadata: Metadata = {
  title: "Add a new studio",
  description: "List your creative studio on StudioSpace and start taking hourly bookings.",
};

export default function AddStudioPage() {
  return (
    <>
      <PageHero
        eyebrow="Host on StudioSpace"
        title={
          <>
            List your
            <br />
            space.
          </>
        }
        description="Ten minutes now, a calendar full of productions later. Add the room, set your rate and publish it to the directory."
      />
      <div className="container-x py-10 sm:py-12">
        <Protected>
          <StudioForm mode="create" />
        </Protected>
      </div>
    </>
  );
}
