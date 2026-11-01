import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { BrandLoader } from "@/components/protected";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to StudioSpace to manage your studio listings and bookings.",
};

export default function LoginPage() {
  return (
    <AuthShell
      image={IMAGES.photoLights}
      quote="We found our studio, booked it before lunch, and shot the whole campaign there the following week."
      attribution="Harry Chen · Photographer & host"
    >
      <Suspense fallback={<BrandLoader label="Opening the door…" compact />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
