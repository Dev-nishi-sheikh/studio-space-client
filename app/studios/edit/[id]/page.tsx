import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Protected } from "@/components/protected";
import { EditStudioClient } from "@/components/studios/edit-studio-client";

export const metadata: Metadata = {
  title: "Edit studio",
  description: "Update the details, pricing and availability of your StudioSpace listing.",
};

export default async function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageHero
        eyebrow="Host tools"
        title="Refine the room."
        description="Keep photos, pricing and amenities current. Changes go live the moment you save."
      />
      <div className="container-x py-10 sm:py-12">
        <Protected>
          <EditStudioClient id={id} />
        </Protected>
      </div>
    </>
  );
}
