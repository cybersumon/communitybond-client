
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LogIn,
  LogOut,
  UserRound,
  LoaderCircle,
   CalendarPlus,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";



/**
 * AuthNav
 *
 * PURPOSE:
 * Display authentication actions in the navbar.
 *
 * STATES:
 * - Loading: checking current session.
 * - Logged out: Login and Register links.
 * - Logged in: User avatar and dropdown.
 *
 * DATA:
 * Better Auth useSession() hook.
 */
export default function AuthNav() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const [loggingOut, setLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Sign out the current user.
   */
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setErrorMessage(
          error.message || "Unable to sign out."
        );
        return;
      }

      // Return to the homepage after logout.
      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign out.");
    } finally {
      setLoggingOut(false);
    }
  }

  // Avoid showing Login buttons before
  // the session check has completed.
  if (isPending) {
    return (
      <div
        aria-label="Checking authentication"
        className="flex h-10 items-center px-3"
      >
        <LoaderCircle
          size={18}
          className="animate-spin text-(--color-muted)"
        />
      </div>
    );
  }

  // User has not signed in.
  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-(--color-foreground) transition hover:text-(--color-primary)"
        >
          <LogIn size={16} aria-hidden="true" />
          Login
        </Link>

        <Link
          href="/register"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-(--color-primary) px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Get Started
        </Link>
      </div>
    );
  }

  // Get the user's display name.
  const userName =
    session.user.name?.trim() ||
    session.user.email.split("@")[0];

  // Generate initials for the avatar.
  const initials = userName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="relative">
      {/* Native details provides a simple,
          keyboard-accessible dropdown toggle. */}
      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 pr-3 transition hover:bg-(--color-background) [&::-webkit-details-marker]:hidden">
          {/* Avatar with user's initials. */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-primary) text-xs font-bold text-white">
            {initials || <UserRound size={16} />}
          </span>

          <span className="hidden max-w-30 truncate text-sm font-semibold text-(--color-foreground) sm:block">
            {userName}
          </span>

          <ChevronDown
            size={15}
            aria-hidden="true"
            className="text-(--color-muted) transition group-open:rotate-180"
          />
        </summary>

        {/* User dropdown. */}
        <div className="absolute right-0 z-100 mt-2 w-64 rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 shadow-xl">
          <div className="border-b border-(--color-border) px-3 py-3">
            <p className="truncate text-sm font-bold text-(--color-foreground)">
              {userName}
            </p>

            <p className="mt-1 truncate text-xs text-(--color-muted)">
              {session.user.email}
            </p>
          </div>

{/* Create Event navigation */}
<Link
  href="/create-event"
  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-(--color-foreground) transition hover:bg-(--color-background) hover:text-(--color-primary)"
>
  <CalendarPlus
    size={17}
    aria-hidden="true"
    className="text-(--color-primary)"
  />
  Create Event
</Link>

{/* Dropdown divider */}
<div className="my-2 border-t border-(--color-border)" />




          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="mt-2 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            {loggingOut ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <LogOut size={17} aria-hidden="true" />
            )}

            {loggingOut ? "Signing out..." : "Logout"}
          </button>

          {errorMessage && (
            <p
              role="alert"
              className="px-3 py-2 text-xs text-red-600"
            >
              {errorMessage}
            </p>
          )}
        </div>
      </details>
    </div>
  );
}
