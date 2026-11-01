"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";
import { WishlistProvider } from "@/components/wishlist-provider";

function AppToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      theme={(resolvedTheme as "light" | "dark") ?? "dark"}
      toastOptions={{
        classNames: {
          toast:
            "font-sans border border-border !rounded-2xl !shadow-[0_18px_50px_-24px_rgba(0,0,0,0.5)]",
          title: "font-bold",
          description: "text-muted",
          actionButton: "!rounded-full",
        },
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <WishlistProvider>
          {children}
          <AppToaster />
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
