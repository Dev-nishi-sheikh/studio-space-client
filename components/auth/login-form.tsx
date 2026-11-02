"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { GoogleIcon } from "@/components/icons";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import { isDemoMode } from "@/lib/api";
import { buttonClass } from "@/lib/ui";
import { isEmail } from "@/lib/utils";

function safeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export function LoginForm() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectTo = safeRedirect(searchParams.get("redirect"));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isEmail(email.trim())) {
      const message = "Enter a valid email address to continue.";
      setError(message);
      toast.error("Check your email", { description: message });
      return;
    }
    if (password.length < 6) {
      const message = "Your password needs at least 6 characters.";
      setError(message);
      toast.error("Password too short", { description: message });
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email: email.trim(), password });
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`, {
        description: "Your studio dashboard is ready.",
      });
      router.push(redirectTo);
      router.refresh();
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "We couldn't sign you in. Try again.";
      setError(message);
      toast.error("Login failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    try {
      const user = await googleLogin(`${window.location.origin}${redirectTo}`);
      if (user) {
        toast.success(`Signed in as ${user.name}`, {
          description: "Google authentication complete.",
        });
        router.push(redirectTo);
        router.refresh();
      }
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Google sign-in didn't work.";
      setError(message);
      toast.error("Google sign-in failed", { description: message });
    } finally {
      setGoogleLoading(false);
    }
  }

  function fillDemo(kind: "host" | "guest") {
    setEmail(DEMO_ACCOUNTS[kind].email);
    setPassword(DEMO_ACCOUNTS[kind].password);
    setError(null);
    toast.info("Demo credentials filled", {
      description: "Press “Log in” to step into the workspace.",
    });
  }

  return (
    <div>
      <span className="eyebrow">Welcome back</span>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
        Back on set.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Log in to manage your listings, bookings and the spaces you&apos;ve saved.
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
          <label htmlFor="login-email" className="label">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@studio.com"
              className="field pl-10"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="label">
              Password
            </label>
            <button
              type="button"
              onClick={() =>
                toast.info("Password resets are handled by email", {
                  description:
                    "This demo skips email delivery. Use the demo credentials below or contact support.",
                })
              }
              className="mb-1.5 text-[0.7rem] font-bold text-accent hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
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
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={buttonClass({ size: "lg", className: "w-full" })}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Log in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">
            or continue with
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

      {isDemoMode && (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-3.5">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-muted">
            Examiner demo access
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemo("host")}
              className={buttonClass({ variant: "soft", size: "sm", className: "text-[0.68rem]" })}
            >
              Use host demo
            </button>
            <button
              type="button"
              onClick={() => fillDemo("guest")}
              className={buttonClass({ variant: "soft", size: "sm", className: "text-[0.68rem]" })}
            >
              Use creator demo
            </button>
          </div>
          <p className="mt-2 text-[0.65rem] leading-relaxed text-muted">
            Both accounts use the password <span className="font-bold text-foreground">Studio123</span>.
          </p>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        New to StudioSpace?{" "}
        <Link href="/register" className="font-bold text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
