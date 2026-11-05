
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  LoaderCircle,
  MailX,
} from "lucide-react";


export default function UnsubscribeForm() {
  const params = useSearchParams();

  const token = params.get("token") ?? "";

  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validToken = /^[a-f0-9]{64}$/.test(token);

  /**
   * Submit unsubscribe request.
   */
  async function unsubscribe() {
    if (working || !validToken) return;

    setWorking(true);
    setError("");

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        "http://localhost:5001";

      const response = await fetch(
        `${apiBase}/api/subscribers/unsubscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? "Unsubscribe failed."
        );
      }

      setMessage(
        result.message ??
          "Unsubscribe processed."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to unsubscribe."
      );
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <MailX
        size={42}
        className="text-(--color-primary)"
      />

      <h1 className="mt-4 text-3xl font-bold text-(--color-foreground)">
        Unsubscribe from alerts
      </h1>

      <p className="mt-3 text-sm text-(--color-muted)">
        Stop receiving CommunityBond local cause
        emails.
      </p>

      {!validToken ? (
        <p
          role="alert"
          className="mt-6 text-sm text-red-600"
        >
          This unsubscribe link is invalid.
        </p>
      ) : message ? (
        <p
          role="status"
          className="mt-6 text-sm font-semibold text-emerald-600"
        >
          {message}
        </p>
      ) : (
        <button
          type="button"
          onClick={unsubscribe}
          disabled={working}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-(--color-primary) px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {working && (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          )}

          {working
            ? "Processing..."
            : "Confirm unsubscribe"}
        </button>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
