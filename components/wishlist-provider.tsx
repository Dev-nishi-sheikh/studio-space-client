"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getWishlist, toggleWishlist } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";

interface WishlistContextValue {
  ids: string[];
  loading: boolean;
  isSaved: (studioId: string) => boolean;
  toggle: (studioId: string) => Promise<boolean>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user) {
      setIds([]);
      return;
    }
    setLoading(true);
    getWishlist(user.email)
      .then((next) => {
        if (active) setIds(next);
      })
      .catch(() => {
        if (active) setIds([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const isSaved = useCallback((studioId: string) => ids.includes(studioId), [ids]);

  const toggle = useCallback(
    async (studioId: string) => {
      if (!user) {
        toast.error("Save studios once you've logged in", {
          description: "Create a free account to keep a shortlist of spaces.",
        });
        return false;
      }
      const wasSaved = ids.includes(studioId);
      try {
        const next = await toggleWishlist(user.email, studioId);
        setIds(next);
        toast.success(wasSaved ? "Removed from your shortlist" : "Saved to your shortlist", {
          description: wasSaved
            ? "You can always add it back from the studio page."
            : "Find all your saved spaces under Wishlist.",
        });
        return !wasSaved;
      } catch (error) {
        toast.error("Couldn't update your shortlist", {
          description: error instanceof Error ? error.message : undefined,
        });
        return wasSaved;
      }
    },
    [ids, user],
  );

  const value = useMemo(
    () => ({ ids, loading, isSaved, toggle }),
    [ids, loading, isSaved, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
