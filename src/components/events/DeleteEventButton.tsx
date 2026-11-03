
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, X, AlertTriangle } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { deleteEventApi } from "@/lib/api/delete-event";

/**
 * DeleteEventButton
 *
 * PURPOSE:
 * Show a confirmation dialog before deleting.
 *
 * FEATURES:
 * - Confirmation modal
 * - Loading state
 * - Error handling
 * - JWT authentication
 * - Instant dashboard update callback
 */

interface DeleteEventButtonProps {
  eventId: string;
  eventTitle: string;
  onDeleted: (eventId: string) => void;
}

export default function DeleteEventButton({
  eventId,
  eventTitle,
  onDeleted,
}: DeleteEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Only render the portal after hydration.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Manage keyboard focus and page scrolling.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    const previouslyFocused =
      document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        setIsOpen(false);
      }

      // Keep keyboard focus within the modal.
      if (
        event.key === "Tab" &&
        dialogRef.current
      ) {
        const buttons = Array.from(
          dialogRef.current.querySelectorAll<
            HTMLButtonElement
          >("button:not(:disabled)")
        );

        if (buttons.length === 0) return;

        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      previouslyFocused?.focus();
    };
  }, [isOpen, isDeleting]);

  function openDialog() {
    setError("");
    setIsOpen(true);
  }

  function closeDialog() {
    if (isDeleting) return;

    setError("");
    setIsOpen(false);
  }

  /**
   * Delete event after confirmation.
   */
  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    setError("");

    try {
      // Retrieve JWT from Better Auth.
      const tokenResponse = await authClient.token();

      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error(
          "Please log in again to delete this event."
        );
      }

      // Call Express backend.
      await deleteEventApi(eventId, token);

      // Update dashboard immediately.
      onDeleted(eventId);

      setIsOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete event."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Delete action on My Events card */}
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
      >
        <Trash2 size={16} strokeWidth={1.8} />
        Delete
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                closeDialog();
              }
            }}
          >
            <div
              ref={dialogRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-event-title"
              aria-describedby="delete-event-description"
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <AlertTriangle size={23} />
                </div>

                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isDeleting}
                  aria-label="Close confirmation dialog"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>

              <h2
                id="delete-event-title"
                className="mt-5 text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Delete this event?
              </h2>

              <p
                id="delete-event-description"
                className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400"
              >
                You are about to delete{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-100">
                  {eventTitle}
                </strong>
                . This action cannot be undone.
              </p>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
                >
                  {error}
                </p>
              )}

              {/* Confirmation actions */}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={closeDialog}
                  disabled={isDeleting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {isDeleting
                    ? "Deleting..."
                    : "Delete Event"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
