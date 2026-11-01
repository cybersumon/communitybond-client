
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { ReactNode } from "react";

/**
 * EventDetailsModal
 *
 * PURPOSE:
 * Display event details in a centered popup.
 *
 * HOW:
 * Use the same fixed-overlay approach that passed
 * our modal-routing test.
 *
 * No native dialog.showModal() or onClose events
 * are needed, avoiding the previous close loop.
 */
export default function EventDetailsModal({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Lock background scrolling and support Escape.
   * Focus the close button when the modal opens.
   */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        router.back();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        // Only dismiss when clicking the backdrop.
        if (event.target === event.currentTarget) {
          router.back();
        }
      }}
    >
      {/* Compact 800px-wide event dialog. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Event details"
        className="relative h-[80dvh] max-h-180 w-full max-w-200 overflow-hidden rounded-3xl bg-(--color-surface) text-(--color-foreground) shadow-2xl"
      >
        {/* Reusable event content fills the dialog. */}
        <div className="h-full">
          {children}
        </div>

        {/* Close button floats over the hero photograph. */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => router.back()}
          aria-label="Close event details"
          className="absolute right-4 top-4 z-50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-black/75"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
