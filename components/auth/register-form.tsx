"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { GoogleIcon } from "@/components/icons";
import { buttonClass } from "@/lib/ui";
import { cn, isEmail, passwordChecks } from "@/lib/utils";

export function RegisterForm() {
  const { register, googleLogin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const checks = passwordChecks(form.password);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.name.trim().length < 2) {
      const message = "Tell us your name — at least 2 characters.";
      setError(message);
      toast.error("Name needed", { description: message });
      return;
    }
    if (!isEmail(form.email.trim())) {
      const message = "Enter a valid email address.";
      setError(message);
      toast.error("Check your email", { description: message });
      return;
    }
    if (form.photoURL.trim() && !/^https?:\/\/.+/i.test(form.photoURL.trim())) {
      const message = "Photo URL must start with http:// or https://.";
      setError(message);
      toast.error("Photo URL looks off", { description: message });
      return;
    }
    if (!checks.uppercase || !checks.lowercase || !checks.length) {
      const message = "Your password needs an uppercase letter, a lowercase letter and 6+ characters.";
      setError(message);
      toast.error("Password doesn't meet the rules", { description: message });
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        photoURL: form.photoURL.trim(),
        password: form.password,
      });
      toast.success("Account created", {
        description: `Log in as ${user.email} to start booking spaces.`,
      });
      router.push(`/login?email=${encodeURIComponent(user.email)}`);
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "We couldn't create your account. Try again.";
      setError(message);
      toast.error("Registration failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    try {
      const user = await googleLogin();
      if (user) {
        toast.success(`Welcome to StudioSpace, ${user.name.split(" ")[0]}`, {
          description: "Your Google account is connected.",
        });
        router.push("/");
        router.refresh();
      }
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Google sign-up didn't work.";
      setError(message);
      toast.error("Google sign-up failed", { description: message });
    } finally {
      setGoogleLoading(false);
    }
  }

  const checkItems = [
    { label: "One uppercase letter", passed: checks.uppercase },
    { label: "One lowercase letter", passed: checks.lowercase },
    { label: "At least 6 characters", passed: checks.length },
  ];

  return (
    <div>
      <span className="eyebrow">Join the studio</span>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
        Make room for
        <br />
        your next idea.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Create a free account to book spaces, save favourites and list your own studio.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-xs font-medium text-red-600 dark:text-red-400"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="register-name" className="label">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="register-name"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Harry Chen"
              autoComplete="name"
              className="field pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className="label">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="register-email"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@studio.com"
              autoComplete="email"
              className="field pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-photo" className="label">
            Photo URL <span className="font-medium text-muted">(optional)</span>
          </label>
          <div className="relative">
            <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="register-photo"
              type="url"
              value={form.photoURL}
              onChange={(event) => update("photoURL", event.target.value)}
              placeholder="https://images.unsplash.com/…"
              autoComplete="photo"
              className="field pl-10 pr-12"
            />
            {form.photoURL && /^https?:\/\//i.test(form.photoURL) && (
              <span className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 overflow-hidden rounded-full border border-border bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.photoURL}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="register-password" className="label">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              className="field px-10"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((show) => !show)}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {checkItems.map((item) => (
              <span
                key={item.label}
                className={cn(
                  "inline-flex items-center gap-1.5 text-[0.67rem] font-semibold transition-colors",
                  item.passed ? "text-emerald-600 dark:text-emerald-400" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "grid h-3.5 w-3.5 place-items-center rounded-full border",
                    item.passed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-border bg-transparent",
                  )}
                >
                  {item.passed && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={buttonClass({ size: "lg", className: "w-full" })}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating your account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">
            or sign up with
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className={buttonClass({ variant: "outline", size: "lg", className: "w-full" })}
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-[18px] w-[18px]" />
          )}
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
