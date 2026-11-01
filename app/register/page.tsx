import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Join StudioSpace to book creative studios and list your own space.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      image={IMAGES.music}
      quote="The room came with a console, a coffee machine and a host who knew exactly how to set up the session."
      attribution="Sana Park · Producer, Echo Park"
    >
      <RegisterForm />
    </AuthShell>
  );
}
