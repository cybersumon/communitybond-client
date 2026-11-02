
"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";

/**
 * GoogleSignInButton
 *
 * PURPOSE:
 * Start Google OAuth authentication using Better Auth.
 *
 * FLOW:
 * Button click -> Better Auth -> Google
 * -> Better Auth callback -> Homepage
 */

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleGoogleLogin() {
    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/login",
      });

      if (error) {
        setErrorMessage(
          error.message || "Google sign-in failed."
        );
        setLoading(false);
      }
    } catch {
      setErrorMessage("Unable to connect to Google.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleLogin}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) px-5 py-3 text-sm font-semibold text-(--color-foreground) transition hover:bg-(--color-background) disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <LoaderCircle
            size={19}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 48 48"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.77 7.18l7.73 6C44.41 38.03 46.98 31.87 46.98 24.55z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        )}

        {loading ? "Connecting..." : "Continue with Google"}
      </button>

      {errorMessage && (
        <p role="alert" className="text-center text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
