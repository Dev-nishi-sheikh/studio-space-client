import type { Metadata } from "next";
import { StudioDetails } from "@/components/studios/studio-details";

export const metadata: Metadata = {
  title: "Studio details",
  description:
    "Explore the room, amenities, reviews and live availability before you book on StudioSpace.",
};

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudioDetails id={id} />;
}
