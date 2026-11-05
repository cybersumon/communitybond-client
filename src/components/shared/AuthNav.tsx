
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  LogIn,
  LogOut,
  UserRound,
  LoaderCircle,
  CalendarPlus,
  CalendarDays,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";


export default function AuthNav() {
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending } =
    authClient.useSession();

  // Logout state
  const [loggingOut, setLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Reference to the native details element
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  /**
   * Close the profile dropdown.
   */
  function closeDropdown() {
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  }

  /**
   * Close dropdown when clicking outside
   * or pressing the Escape key.
   */
  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      const dropdown = dropdownRef.current;

      if (!dropdown || !dropdown.open) {
        return;
      }

      if (
        event.target instanceof Node &&
        !dropdown.contains(event.target)
      ) {
        dropdown.open = false;
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const dropdown = dropdownRef.current;

        if (dropdown?.open) {
          dropdown.open = false;

          // Return keyboard focus to the trigger.
          dropdown.querySelector("summary")?.focus();
        }
      }
    }

    document.addEventListener(
      "pointerdown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscapeKey
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscapeKey
      );
    };
  }, []);

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

      // Close dropdown after successful logout.
      closeDropdown();

      // Return to homepage.
      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign out.");
    } finally {
      setLoggingOut(false);
    }
  }

  /**
   * Loading state.
   */
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

  /**
   * Guest navigation.
   */
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

  /**
   * Resolve display name and avatar initials.
   */
  const userName =
    session.user.name?.trim() ||
    session.user.email.split("@")[0];

  const initials = userName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="relative">
      <details
        ref={dropdownRef}
        className="group relative"
      >
        {/* Profile dropdown trigger */}
        <summary
          className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) p-1.5 pr-3 transition hover:bg-(--color-background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) [&::-webkit-details-marker]:hidden"
        >
          {/* Avatar */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-primary) text-xs font-bold text-white">
            {initials || (
              <UserRound size={16} aria-hidden="true" />
            )}
          </span>

          {/* User name */}
          <span className="hidden max-w-30 truncate text-sm font-semibold text-(--color-foreground) sm:block">
            {userName}
          </span>

          {/* Dropdown indicator */}
          <ChevronDown
            size={15}
            aria-hidden="true"
            className="text-(--color-muted) transition-transform duration-200 group-open:rotate-180"
          />
        </summary>

        {/* Profile dropdown panel */}
        <div className="absolute right-0 z-100 mt-2 w-64 rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 shadow-xl">

          {/* User information */}
          <div className="border-b border-(--color-border) px-3 py-3">
            <p className="truncate text-sm font-bold text-(--color-foreground)">
              {userName}
            </p>

            <p className="mt-1 truncate text-xs text-(--color-muted)">
              {session.user.email}
            </p>
          </div>

          {/* Create Event */}
          <Link
            href="/create-event"
            onClick={closeDropdown}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-(--color-foreground) transition hover:bg-(--color-background) hover:text-(--color-primary)"
          >
            <CalendarPlus
              size={17}
              aria-hidden="true"
              className="text-(--color-primary)"
            />
            Create Event
          </Link>

          {/* My Events */}
          <Link
            href="/my-events"
            onClick={closeDropdown}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-(--color-foreground) transition hover:bg-(--color-background) hover:text-(--color-primary)"
          >
            <CalendarDays
              size={17}
              aria-hidden="true"
              className="text-(--color-primary)"
            />
            My Events
          </Link>

          {/* My Joined Events */}
          <Link
            href="/my-joined-events"
            onClick={closeDropdown}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-(--color-foreground) transition hover:bg-(--color-background) hover:text-(--color-primary)"
          >
            <CalendarDays
              size={17}
              aria-hidden="true"
              className="text-(--color-primary)"
            />
            My Joined Events
          </Link>

          {/* Dropdown divider */}
          <div className="my-2 border-t border-(--color-border)" />

          {/* Logout button */}
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
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

            {loggingOut
              ? "Signing out..."
              : "Logout"}
          </button>

          {/* Logout error */}
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
