
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

/**
 * Subscription function for hydration-safe rendering.
 *
 * WHY:
 * Theme values are only reliably available in the browser.
 * We use a stable empty subscription because we only need
 * to distinguish server rendering from client rendering.
 */
const emptySubscribe = () => () => {};

/**
 * ThemeToggle Component
 *
 * PURPOSE:
 * Let users switch between light and dark themes.
 *
 * HOW:
 * useTheme reads the active theme and provides setTheme().
 * setTheme() updates the entire application theme.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Avoid displaying theme-dependent UI during server rendering.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Render a stable placeholder until hydration finishes.
  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="h-10 w-10 rounded-xl"
      />
    );
  }

  // Determine the currently active theme.
  const isDark = resolvedTheme === "dark";

  // Switch to the opposite theme when clicked.
  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)]"
    >
      {/* Show a sun in dark mode and a moon in light mode. */}
      <span aria-hidden="true" className="text-xl">
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
