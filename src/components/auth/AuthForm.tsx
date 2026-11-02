
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Mail,
  UserRound,
  LoaderCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import PasswordInput from "./PasswordInput";
import GoogleSignInButton from "./GoogleSignInButton";
/**
 * AuthForm
 *
 * PURPOSE:
 * Reuse one authentication UI for Login and Register.
 *
 * DATA FLOW:
 * Form -> Better Auth Client -> Next.js Auth API
 * -> MongoDB -> Session
 *
 * SECURITY:
 * Better Auth handles password hashing and sessions.
 * Never store passwords in localStorage.
 */
type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const isRegister = mode === "register";

  // Input state.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Request and feedback state.
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Validate and submit user credentials.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setErrorMessage("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validate registration-only fields.
    if (isRegister && !normalizedName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Create a new Better Auth user.
        const { error } = await authClient.signUp.email({
          name: normalizedName,
          email: normalizedEmail,
          password,
        });

        if (error) {
          setErrorMessage(
            error.message || "Unable to create your account."
          );
          return;
        }
      } else {
        // Authenticate an existing user.
        const { error } = await authClient.signIn.email({
          email: normalizedEmail,
          password,
        });

        if (error) {
          setErrorMessage(
            error.message || "Invalid email or password."
          );
          return;
        }
      }

      // Better Auth signs users in after registration
      // with the current autoSignIn default.
      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Brand icon. */}
      <div className="mb-7 inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-(--color-primary) text-white shadow-lg shadow-emerald-900/10">
        <HeartHandshake size={26} aria-hidden="true" />
      </div>

      {/* Heading. */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-(--color-primary)">
          CommunityBond
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-(--color-foreground)">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-(--color-muted)">
          {isRegister
            ? "Join your community and start making a meaningful difference."
            : "Sign in to continue your journey of positive change."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name is only required during registration. */}
        {isRegister && (
          <div className="space-y-2">
            <label
              htmlFor="auth-name"
              className="text-sm font-semibold text-(--color-foreground)"
            >
              Full name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-muted)"
              />

              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-(--color-border) bg-(--color-background) py-3 pl-11 pr-4 text-sm text-(--color-foreground) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
              />
            </div>
          </div>
        )}

        {/* Email input. */}
        <div className="space-y-2">
          <label
            htmlFor="auth-email"
            className="text-sm font-semibold text-(--color-foreground)"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-muted)"
            />

            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-(--color-border) bg-(--color-background) py-3 pl-11 pr-4 text-sm text-(--color-foreground) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
            />
          </div>
        </div>

        {/* Reusable password field. */}
        <PasswordInput
          value={password}
          onChange={setPassword}
          autoComplete={
            isRegister ? "new-password" : "current-password"
          }
        />

        {/* Confirm password when registering. */}
        {isRegister && (
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="text-sm font-semibold text-(--color-foreground)"
            >
              Confirm password
            </label>

            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Enter password again"
              className="w-full rounded-xl border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm text-(--color-foreground) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
            />
          </div>
        )}

        {/* Error feedback without console.error overlay. */}
        {errorMessage && (
          <p
            role="alert"
            className="rounded-xl border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {/* Submit button. */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
              Please wait...
            </>
          ) : (
            <>
              {isRegister ? "Create account" : "Sign in"}
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </form>

{/* Divider between password and social login. */}
<div className="my-6 flex items-center gap-4">
  <div className="h-px flex-1 bg-(--color-border)" />

  <span className="text-xs font-medium text-(--color-muted)">
    or continue with
  </span>

  <div className="h-px flex-1 bg-(--color-border)" />
</div>

{/* Google OAuth sign-in works for login and registration. */}
<GoogleSignInButton />


      {/* Switch between authentication modes. */}
      <p className="mt-7 text-center text-sm text-(--color-muted)">
        {isRegister
          ? "Already have an account?"
          : "New to CommunityBond?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-bold text-(--color-primary) hover:underline"
        >
          {isRegister ? "Sign in" : "Create account"}
        </Link>
      </p>
    </div>
  );
}
