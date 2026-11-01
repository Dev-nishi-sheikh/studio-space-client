"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import { createStudio, updateStudio } from "@/lib/api";
import type { Category, Studio, StudioDraft } from "@/lib/types";
import { uploadStudioImage } from "@/lib/upload";
import { badgeClass, buttonClass } from "@/lib/ui";
import { cn, formatCurrency } from "@/lib/utils";

const emptyForm = {
  title: "",
  category: "Photo Studio" as Category,
  hourlyRate: "",
  securityDeposit: "",
  capacity: "",
  location: "",
  image: "",
  gallery: "",
  overview: "",
};

export function StudioForm({
  mode,
  studio,
}: {
  mode: "create" | "edit";
  studio?: Studio;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(() =>
    studio
      ? {
          title: studio.title,
          category: studio.category,
          hourlyRate: String(studio.hourlyRate),
          securityDeposit: String(studio.securityDeposit),
          capacity: String(studio.capacity),
          location: studio.location,
          image: studio.image,
          gallery: studio.gallery.filter((image) => image !== studio.image).join("\n"),
          overview: studio.overview,
        }
      : emptyForm,
  );
  const [amenities, setAmenities] = useState<string[]>(studio?.amenities ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const galleryImages = useMemo(
    () =>
      form.gallery
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [form.gallery],
  );

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
    setErrors((current) => {
      if (!current.amenities) return current;
      const next = { ...current };
      delete next.amenities;
      return next;
    });
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadStudioImage(file);
      update("image", url);
      toast.success("Image added", {
        description: "Your cover image is ready. Add more shots in the gallery field below.",
      });
    } catch (reason) {
      toast.error("Image upload failed", {
        description: reason instanceof Error ? reason.message : "Try pasting an image URL instead.",
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function validate() {
    const next: Record<string, string> = {};
    if (form.title.trim().length < 4) next.title = "Give the space a title of at least 4 characters.";
    if (!Number(form.hourlyRate) || Number(form.hourlyRate) < 1)
      next.hourlyRate = "Set an hourly rate of at least $1.";
    if (form.securityDeposit === "" || Number(form.securityDeposit) < 0)
      next.securityDeposit = "Enter a security deposit (0 is fine).";
    if (!Number(form.capacity) || Number(form.capacity) < 1)
      next.capacity = "Capacity must be at least 1 person.";
    if (form.location.trim().length < 3) next.location = "Add a neighbourhood or address.";
    if (!/^(https?:\/\/|data:image\/).+/i.test(form.image.trim()))
      next.image = "Add a cover image URL or upload a photo.";
    if (form.overview.trim().length < 40)
      next.overview = "Tell guests a little more — at least 40 characters.";
    if (amenities.length === 0) next.amenities = "Choose at least one amenity or feature.";
    const badGallery = galleryImages.some((url) => !/^(https?:\/\/|data:image\/).+/i.test(url));
    if (badGallery) next.gallery = "Each gallery line must be a full image URL.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    if (!validate()) {
      toast.error("A few details need attention", {
        description: "Check the highlighted fields and try again.",
      });
      return;
    }

    const gallery = Array.from(new Set([form.image.trim(), ...galleryImages]));

    const draft: StudioDraft = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit),
      capacity: Number(form.capacity),
      location: form.location.trim(),
      image: form.image.trim(),
      gallery,
      amenities,
      overview: form.overview.trim(),
    };

    setSubmitting(true);
    try {
      if (mode === "edit" && studio) {
        await updateStudio(studio._id, draft, user);
        toast.success("Listing updated", {
          description: `${draft.title} now shows your latest details.`,
        });
      } else {
        await createStudio(draft, user);
        toast.success("Studio published", {
          description: `${draft.title} is now live in the StudioSpace directory.`,
        });
      }
      router.push("/my-listings");
      router.refresh();
    } catch (reason) {
      toast.error(mode === "edit" ? "Couldn't update the listing" : "Couldn't publish the studio", {
        description: reason instanceof Error ? reason.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_330px] lg:gap-10" noValidate>
      <div className="min-w-0 space-y-5">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/12 text-accent">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold">The basics</h2>
              <p className="text-xs text-muted">Name the room and tell us where it is.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="studio-title" className="label">
                Listing title <span className="text-accent">*</span>
              </label>
              <input
                id="studio-title"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="e.g. The Daylight Loft"
                className={cn("field", errors.title && "border-red-500/70")}
              />
              {errors.title && <p className="mt-1.5 text-[0.7rem] text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="studio-category" className="label">
                Category <span className="text-accent">*</span>
              </label>
              <select
                id="studio-category"
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                className="field"
              >
                {CATEGORIES.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="studio-location" className="label">
                Location / address <span className="text-accent">*</span>
              </label>
              <input
                id="studio-location"
                value={form.location}
                onChange={(event) => update("location", event.target.value)}
                placeholder="Arts District, Los Angeles"
                className={cn("field", errors.location && "border-red-500/70")}
              />
              {errors.location && (
                <p className="mt-1.5 text-[0.7rem] text-red-500">{errors.location}</p>
              )}
            </div>
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Pricing &amp; capacity</h2>
          <p className="text-xs text-muted">Keep it transparent — guests see these figures up front.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="studio-rate" className="label">
                Hourly rate ($) <span className="text-accent">*</span>
              </label>
              <input
                id="studio-rate"
                type="number"
                min={1}
                step={1}
                value={form.hourlyRate}
                onChange={(event) => update("hourlyRate", event.target.value)}
                placeholder="85"
                className={cn("field", errors.hourlyRate && "border-red-500/70")}
              />
              {errors.hourlyRate && (
                <p className="mt-1.5 text-[0.7rem] text-red-500">{errors.hourlyRate}</p>
              )}
            </div>

            <div>
              <label htmlFor="studio-deposit" className="label">
                Security deposit ($) <span className="text-accent">*</span>
              </label>
              <input
                id="studio-deposit"
                type="number"
                min={0}
                step={1}
                value={form.securityDeposit}
                onChange={(event) => update("securityDeposit", event.target.value)}
                placeholder="200"
                className={cn("field", errors.securityDeposit && "border-red-500/70")}
              />
              {errors.securityDeposit && (
                <p className="mt-1.5 text-[0.7rem] text-red-500">{errors.securityDeposit}</p>
              )}
            </div>

            <div>
              <label htmlFor="studio-capacity" className="label">
                Max capacity <span className="text-accent">*</span>
              </label>
              <input
                id="studio-capacity"
                type="number"
                min={1}
                step={1}
                value={form.capacity}
                onChange={(event) => update("capacity", event.target.value)}
                placeholder="12"
                className={cn("field", errors.capacity && "border-red-500/70")}
              />
              {errors.capacity && (
                <p className="mt-1.5 text-[0.7rem] text-red-500">{errors.capacity}</p>
              )}
            </div>
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Visuals</h2>
          <p className="text-xs text-muted">
            Use a high-resolution landscape photo. The cover image leads your card.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-dashed border-border bg-background">
                {form.image ? (
                  <>
                    <Image
                      src={form.image}
                      alt="Studio cover preview"
                      fill
                      sizes="320px"
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => update("image", "")}
                      aria-label="Remove cover image"
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                    <ImageIcon className="h-6 w-6 text-muted" />
                    <p className="text-[0.7rem] text-muted">No cover image yet</p>
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className={buttonClass({ variant: "outline", size: "sm", className: "mt-3 w-full" })}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {uploading ? "Uploading…" : "Upload cover image"}
              </button>
            </div>

            <div>
              <label htmlFor="studio-image" className="label">
                Cover image URL <span className="text-accent">*</span>
              </label>
              <input
                id="studio-image"
                value={form.image}
                onChange={(event) => update("image", event.target.value)}
                placeholder="https://images.unsplash.com/…"
                className={cn("field", errors.image && "border-red-500/70")}
              />
              {errors.image && <p className="mt-1.5 text-[0.7rem] text-red-500">{errors.image}</p>}

              <label htmlFor="studio-gallery" className="label mt-4">
                Extra gallery URLs <span className="font-medium text-muted">(one per line)</span>
              </label>
              <textarea
                id="studio-gallery"
                rows={4}
                value={form.gallery}
                onChange={(event) => update("gallery", event.target.value)}
                placeholder={"https://images.unsplash.com/…\nhttps://images.unsplash.com/…"}
                className={cn("field resize-none text-xs", errors.gallery && "border-red-500/70")}
              />
              {errors.gallery && (
                <p className="mt-1.5 text-[0.7rem] text-red-500">{errors.gallery}</p>
              )}
              <p className="mt-2 text-[0.65rem] leading-relaxed text-muted">
                Upload a cover, or paste hosted image links. Up to 4 gallery images are shown on the
                detail page.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Amenities</h2>
              <p className="text-xs text-muted">Tap everything included with the room.</p>
            </div>
            <span className="text-[0.65rem] font-bold text-muted">{amenities.length} selected</span>
          </div>
          {errors.amenities && (
            <p className="mt-2 text-[0.7rem] text-red-500">{errors.amenities}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {AMENITIES.map((amenity) => {
              const selected = amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  {amenity}
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Detailed overview</h2>
          <p className="text-xs text-muted">
            What makes the room special? Mention light, access, noise and anything a crew should know.
          </p>
          <textarea
            id="studio-overview"
            rows={6}
            value={form.overview}
            onChange={(event) => update("overview", event.target.value)}
            placeholder="A sun-soaked corner loft with eight-foot windows, a seamless cyc wall and a quiet green room…"
            className={cn("field mt-4 resize-none", errors.overview && "border-red-500/70")}
          />
          <div className="mt-1.5 flex items-center justify-between">
            {errors.overview ? (
              <p className="text-[0.7rem] text-red-500">{errors.overview}</p>
            ) : (
              <span />
            )}
            <span className="text-[0.65rem] text-muted">{form.overview.length} characters</span>
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <h2 className="font-display text-xl font-semibold">Host details</h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            These come from your account and stay read-only on the listing.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Host name</label>
              <input value={user?.name ?? ""} readOnly disabled className="field" />
            </div>
            <div>
              <label className="label">Host email</label>
              <input value={user?.email ?? ""} readOnly disabled className="field" />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/my-listings" className={buttonClass({ variant: "ghost", size: "md" })}>
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploading}
            className={buttonClass({ size: "lg", className: "sm:min-w-[13rem]" })}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "edit" ? "Saving changes…" : "Publishing…"}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === "edit" ? "Save changes" : "Publish studio"}
              </>
            )}
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-xs font-medium text-red-600 dark:text-red-400">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            Some fields still need attention before this listing can go live.
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="eyebrow">Live preview</p>
        <div className="mt-3 overflow-hidden rounded-[1.35rem] border border-border bg-surface">
          <div className="relative aspect-[4/3] bg-surface-2">
            {form.image ? (
              <Image
                src={form.image}
                alt="Listing preview"
                fill
                sizes="330px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted/50" />
              </div>
            )}
            <span className="absolute left-3 top-3">
              <span className={badgeClass("accent", "bg-background/90 backdrop-blur")}>
                {form.category}
              </span>
            </span>
          </div>
          <div className="p-4">
            <h3 className="font-display text-lg font-semibold leading-snug">
              {form.title || "Your studio title"}
            </h3>
            <p className="mt-1 text-xs text-muted">{form.location || "Neighbourhood, city"}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <p className="font-display text-lg font-semibold">
                {form.hourlyRate ? formatCurrency(Number(form.hourlyRate)) : "$0"}
                <span className="ml-1 text-[0.65rem] font-medium text-muted">/ hr</span>
              </p>
              <span className="text-[0.65rem] font-bold text-muted">
                {amenities.length} amenities
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[0.68rem] leading-relaxed text-muted">
          This is how your card will appear in the directory. You can update it any time from My
          Studio Listings.
        </p>
      </aside>
    </form>
  );
}
