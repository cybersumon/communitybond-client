
"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { createPortal } from "react-dom";

import {
  AlertTriangle,
  LoaderCircle,
  LogOut,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { leaveEventApi } from "@/lib/api/joined-events";



interface LeaveEventButtonProps {
  eventId: string;
  eventTitle: string;
  onLeft: (eventId: string) => void;
}


const REGISTRATION_CHANGED =
  "communitybond:registration-changed";


function subscribeToClient() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/**
 * Leave Event Button Component.
 */
export default function LeaveEventButton({
  eventId,
  eventTitle,
  onLeft,
}: LeaveEventButtonProps) {
  // Confirmation modal state.
  const [open, setOpen] = useState(false);

  // API loading state.
  const [leaving, setLeaving] = useState(false);

  // API error message.
  const [error, setError] = useState("");

  // Modal references.
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

 
  const mounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot
  );


  useEffect(() => {
    if (!open) return;

    const previousFocus =
      document.activeElement as HTMLElement | null;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      // Close dialog using Escape.
      if (event.key === "Escape") {
        if (!leaving) {
          event.preventDefault();
          setOpen(false);
        }

        return;
      }

      // Keep keyboard focus inside modal.
      if (
        event.key !== "Tab" ||
        !dialogRef.current
      ) {
        return;
      }

      const buttons = Array.from(
        dialogRef.current.querySelectorAll<
          HTMLButtonElement
        >("button:not(:disabled)")
      );

      if (buttons.length === 0) {
        event.preventDefault();
        return;
      }

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

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open, leaving]);

 
  function handleOpen() {
    if (leaving) return;

    setError("");
    setOpen(true);
  }

  
  function handleClose() {
    if (leaving) return;

    setError("");
    setOpen(false);
  }

  
  async function handleLeave() {
    if (leaving) return;

    setLeaving(true);
    setError("");

    try {
      // Get verified authentication token.
      const tokenResponse =
        await authClient.token();

      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      // Remove volunteer registration in MongoDB.
      await leaveEventApi(eventId, token);

      window.dispatchEvent(
        new CustomEvent(
          REGISTRATION_CHANGED,
          {
            detail: {
              eventId,
              joined: false,
            },
          }
        )
      );

   
      onLeft(eventId);

      // Close confirmation modal.
      setOpen(false);
    } catch (err) {
      // Keep modal open and show the error.
      setError(
        err instanceof Error
          ? err.message
          : "Unable to leave this event. Please try again."
      );
    } finally {
      setLeaving(false);
    }
  }

  return (
    <>
      {/* Leave Event trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={leaving}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
      >
        <LogOut size={16} aria-hidden="true" />
        Leave Event
      </button>

      {/* Hydration-safe confirmation modal */}
      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              // Only close when clicking the backdrop.
              if (
                event.target === event.currentTarget
              ) {
                handleClose();
              }
            }}
          >
            <div
              ref={dialogRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="leave-title"
              aria-describedby="leave-description"
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <AlertTriangle
                    size={23}
                    aria-hidden="true"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={leaving}
                  aria-label="Close confirmation dialog"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X size={19} aria-hidden="true" />
                </button>
              </div>

              {/* Modal title */}
              <h2
                id="leave-title"
                className="mt-5 text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Leave this event?
              </h2>

              {/* Confirmation description */}
              <p
                id="leave-description"
                className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400"
              >
                You will be removed from{" "}
                <strong className="font-semibold text-slate-800 dark:text-slate-100">
                  {eventTitle}
                </strong>
                . You can join again later if the
                event is still accepting volunteers.
              </p>

              {/* API error message */}
              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                >
                  {error}
                </p>
              )}

              {/* Confirmation actions */}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={handleClose}
                  disabled={leaving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLeave}
                  disabled={leaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {leaving ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Leaving...
                    </>
                  ) : (
                    <>
                      <LogOut
                        size={16}
                        aria-hidden="true"
                      />
                      Confirm Leave
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
