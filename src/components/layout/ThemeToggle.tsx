
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};


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
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-foreground) transition-colors hover:border-(--color-primary)"
    >
      {/* Show a sun in dark mode and a moon in light mode. */}
      <span aria-hidden="true" className="text-xl">
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
