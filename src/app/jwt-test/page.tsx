
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, LoaderCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";

/**
 * JWT Integration Test Page
 *
 * PURPOSE:
 * Verify communication between Better Auth
 * and our protected Express API.
 *
 * SECURITY:
 * - Do not display JWT tokens.
 * - Do not store JWT tokens in localStorage.
 * - Request a fresh token for each test.
 *
 * This is a temporary development page.
 */
export default function JwtTestPage() {
  const { data: session, isPending } =
    authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verifiedUserId, setVerifiedUserId] = useState("");

  async function testProtectedApi() {
    setLoading(true);
    setMessage("");
    setVerifiedUserId("");

    try {
      // Get a signed JWT from Better Auth.
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setMessage("Unable to obtain an authentication token.");
        return;
      }

      // Pass the token to Express in the Authorization header.
      const response = await fetch(
        "http://localhost:5000/api/auth-test/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        }
      );

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        user?: {
          id: string;
        };
      };

      if (!response.ok || !result.success) {
        setMessage(
          `HTTP ${response.status}: ${result.message}`
        );
        return;
      }

      // Display verification result, never the JWT itself.
      setVerifiedUserId(result.user?.id || "");
      setMessage("Express JWT verification successful!");
    } catch {
      setMessage(
        "Request failed. Check that both servers are running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-5 py-12">
      <section className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-7 shadow-sm">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-primary) text-white">
          <ShieldCheck size={25} aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-(--color-foreground)">
          Express JWT Authentication Test
        </h1>

        <p className="mt-3 text-sm leading-6 text-(--color-muted)">
          Verify that your Express API accepts
          a Better Auth access token.
        </p>

        <div className="mt-6 rounded-xl border border-(--color-border) p-4">
          {isPending ? (
            <p className="text-sm text-(--color-muted)">
              Checking session...
            </p>
          ) : session?.user ? (
            <p className="text-sm text-(--color-foreground)">
              Signed in as{" "}
              <strong>{session.user.name}</strong>
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-(--color-muted)">
                Sign in before testing the protected API.
              </p>

              <Link
                href="/login"
                className="text-sm font-semibold text-(--color-primary) hover:underline"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={loading || isPending || !session?.user}
          onClick={testProtectedApi}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && (
            <LoaderCircle
              size={18}
              className="animate-spin"
              aria-hidden="true"
            />
          )}

          {loading ? "Verifying..." : "Test Protected API"}
        </button>

        {message && (
          <p
            role="status"
            className="mt-5 text-sm text-(--color-foreground)"
          >
            {message}
          </p>
        )}

        {verifiedUserId && (
          <p className="mt-2 break-all text-xs text-(--color-muted)">
            Verified User ID: {verifiedUserId}
          </p>
        )}
      </section>
    </main>
  );
}
