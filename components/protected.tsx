"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Aperture } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export function BrandLoader({
  label = "Finding your space…",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex items-center gap-3 py-8 text-sm text-muted"
          : "flex min-h-[55vh] flex-col items-center justify-center gap-5 px-6 text-center"
      }
    >
      <div className="relative grid h-14 w-14 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full border border-accent/30" />
        <span className="absolute inset-0 rounded-full border border-border" />
        <Aperture className="h-7 w-7 animate-spin text-accent [animation-duration:3.2s]" strokeWidth={1.6} />
      </div>
      <div>
        <p className="font-display text-lg font-semibold">StudioSpace</p>
        <p className="mt-1 text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || user) return;
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return <BrandLoader label="Checking your backstage pass…" />;
  }

  return <>{children}</>;
}
