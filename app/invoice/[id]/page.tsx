import type { Metadata } from "next";
import { Protected } from "@/components/protected";
import { InvoiceClient } from "@/components/invoice/invoice-client";

export const metadata: Metadata = {
  title: "Booking invoice",
  description: "Downloadable receipt for your StudioSpace booking.",
};

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Protected>
      <InvoiceClient id={id} />
    </Protected>
  );
}
