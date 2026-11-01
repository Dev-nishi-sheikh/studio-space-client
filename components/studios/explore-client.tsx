"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { StudioCard } from "@/components/studio-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StudioGridSkeleton } from "@/components/ui/skeleton";
import { getStudios } from "@/lib/api";
import { CATEGORIES, CATEGORY_NAMES } from "@/lib/constants";
import type { Studio, StudioQuery } from "@/lib/types";
import { buttonClass } from "@/lib/ui";
import { cn, formatCurrency, pluralize } from "@/lib/utils";

const MAX_PRICE = 300;

const sortOptions: { value: NonNullable<StudioQuery["sort"]>; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function ExploreClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState(
    CATEGORY_NAMES.includes(initialCategory as (typeof CATEGORY_NAMES)[number])
      ? initialCategory
      : "",
  );
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<NonNullable<StudioQuery["sort"]>>("recommended");
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getStudios({
      search: debouncedSearch.trim() || undefined,
      category: category || undefined,
      maxPrice: maxPrice < MAX_PRICE ? maxPrice : undefined,
      sort,
    })
      .then((result) => {
        if (active) setStudios(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message = reason instanceof Error ? reason.message : "Couldn't load studios.";
        setError(message);
        toast.error("The studio list didn't load", { description: message });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, category, maxPrice, sort, reloadKey]);

  const activeFilters = useMemo(() => {
    let count = 0;
    if (search.trim()) count += 1;
    if (category) count += 1;
    if (maxPrice < MAX_PRICE) count += 1;
    if (sort !== "recommended") count += 1;
    return count;
  }, [search, category, maxPrice, sort]);

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setMaxPrice(MAX_PRICE);
    setSort("recommended");
  }

  return (
    <div className="container-x py-10 sm:py-14">
      <div className="rounded-[1.5rem] border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, neighbourhood or room type…"
              aria-label="Search studios"
              className="field h-12 bg-background pl-11 pr-11 text-[0.9rem]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-surface-2 text-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className={buttonClass({
                variant: filtersOpen ? "primary" : "outline",
                size: "md",
                className: "lg:hidden",
              })}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-black/15 px-1 text-[0.6rem] dark:bg-white/15">
                  {activeFilters}
                </span>
              )}
            </button>

            <div className="hidden items-center gap-2 lg:flex">
              <label htmlFor="sort" className="text-[0.7rem] font-bold text-muted">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as typeof sort)}
                className="field h-10 w-[11.5rem] bg-background py-0 text-xs font-semibold"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors",
              category === ""
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted hover:text-foreground",
            )}
          >
            All spaces
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setCategory(item.name)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors",
                category === item.name
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          className={cn(
            "mt-4 items-end gap-6 border-t border-border pt-4 lg:flex",
            filtersOpen ? "flex flex-col sm:flex-row sm:items-end" : "hidden",
          )}
        >
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between">
              <label htmlFor="price" className="text-[0.7rem] font-bold text-muted">
                Max hourly rate
              </label>
              <span className="text-xs font-bold">
                {maxPrice >= MAX_PRICE ? "Any price" : `${formatCurrency(maxPrice)} / hr`}
              </span>
            </div>
            <input
              id="price"
              type="range"
              min={30}
              max={MAX_PRICE}
              step={5}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-[var(--accent)]"
            />
          </div>

          <div className="lg:hidden">
            <label htmlFor="sort-mobile" className="label">
              Sort by
            </label>
            <select
              id="sort-mobile"
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
              className="field h-10 bg-background py-0 text-xs font-semibold"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
              Finding spaces…
            </span>
          ) : (
            <>
              <span className="font-bold text-foreground">{studios.length}</span>{" "}
              {pluralize(studios.length, "space")}
              {category ? ` in ${category}` : " available"}
              {debouncedSearch ? ` for “${debouncedSearch}”` : ""}
            </>
          )}
        </p>
        {activeFilters > 0 && !loading && (
          <p className="text-xs text-muted">{activeFilters} active filter{activeFilters > 1 ? "s" : ""}</p>
        )}
      </div>

      <div className="mt-5">
        {loading && <StudioGridSkeleton count={6} />}

        {!loading && error && (
          <EmptyState
            icon={SearchX}
            title="The listings didn't load"
            description={error}
            actionLabel="Try again"
            onAction={() => setReloadKey((key) => key + 1)}
            secondaryLabel="Clear filters"
            secondaryHref="/studios"
          />
        )}

        {!loading && !error && studios.length === 0 && (
          <EmptyState
            icon={SearchX}
            title="No rooms match that brief"
            description="Try a broader category, lift the price ceiling, or clear the search and start again. New spaces land every week."
            actionLabel="Clear filters"
            onAction={clearFilters}
            secondaryLabel="Browse everything"
            secondaryHref="/studios"
          />
        )}

        {!loading && !error && studios.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
