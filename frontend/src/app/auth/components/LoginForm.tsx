"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { homeFor } from "@/lib/roles";

const inputClasses =
  "w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

// UI only: not connected to the backend yet. Replace the timeout in
// handleSubmit with the real POST /auth/login call when wiring it up.
export default function LoginForm() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace(homeFor(user.role));
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    const msg = await login(email, password); // error message or null
    if (msg) {
      setError(msg);
      setSubmitting(false); // re-enable the button on failure
      return;
    }
  }

  const borderClass = error ? "border-error" : "border-border";

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white">
          Rx
        </span>
        <span className="text-xl font-bold text-foreground">PharMaMa</span>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Welcome back
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in with the account your admin created for you.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-lg border border-error/25 bg-error/5 px-3.5 py-3 text-sm text-error"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@pharmama.com"
            className={`${inputClasses} ${borderClass}`}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`${inputClasses} ${borderClass} pr-16`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !email || !password}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-950 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-7 border-t border-border pt-5 text-center text-sm text-muted-foreground">
        Don&apos;t have an account? Ask an{" "}
        <span className="font-semibold text-foreground">Admin</span> or{" "}
        <span className="font-semibold text-foreground">Owner</span> to create
        one.
      </p>
    </div>
  );
}
