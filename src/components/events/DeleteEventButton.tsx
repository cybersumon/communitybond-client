
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
  Trash2,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { deleteEventApi } from "@/lib/api/delete-event";



interface DeleteEventButtonProps {
  eventId: string;
  eventTitle: string;
  onDeleted: (eventId: string) => void;
}


function subscribeToClient() {
  return () => {};
}


function getClientSnapshot() {
  return true;
}


function getServerSnapshot() {
  return false;
}

export default function DeleteEventButton({
  eventId,
  eventTitle,
  onDeleted,
}: DeleteEventButtonProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  
  const mounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot
  );

  
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  
  const deletingRef = useRef(false);

  
  function openDialog() {
    if (deletingRef.current) {
      return;
    }

    setError("");
    setIsOpen(true);
  }

  
  function closeDialog() {
    if (deletingRef.current) {
      return;
    }

    setError("");
    setIsOpen(false);
  }

 
  useEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

   
    const triggerElement = triggerRef.current;
    const dialogElement = dialogRef.current;
    const cancelElement = cancelRef.current;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow =
      document.body.style.overflow;

    
    document.body.style.overflow = "hidden";

    
    cancelElement?.focus();

    
    function handleKeyDown(event: KeyboardEvent) {
      
      if (event.key === "Escape") {
        event.preventDefault();

        if (!deletingRef.current) {
          setIsOpen(false);
        }

        return;
      }

      /**
       * Keep keyboard focus inside the dialog.
       */
      if (
        event.key !== "Tab" ||
        !dialogElement
      ) {
        return;
      }

      const focusableElements = Array.from(
        dialogElement.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) => element.getClientRects().length > 0
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last =
        focusableElements[focusableElements.length - 1];

      
      if (
        !dialogElement.contains(
          document.activeElement
        )
      ) {
        event.preventDefault();
        first.focus();
        return;
      }

      
      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      }

      
      if (
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

     
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      } else if (triggerElement?.isConnected) {
        triggerElement.focus();
      }
    };
  }, [isOpen, mounted]);

  
  async function handleDelete() {
    if (deletingRef.current) {
      return;
    }

    
    deletingRef.current = true;

    setIsDeleting(true);
    setError("");

    try {
      
      const tokenResponse =
        await authClient.token();

      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error(
          "Please log in again to delete this event."
        );
      }

     
      await deleteEventApi(eventId, token);

     
      setIsOpen(false);

      
      onDeleted(eventId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete event."
      );
    } finally {
      deletingRef.current = false;
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Delete button on the event card */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        disabled={isDeleting}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
      >
        <Trash2
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
        />

        Delete
      </button>

      {/* Confirmation dialog portal */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              /**
               * Close only when clicking
               * directly on the backdrop.
               */
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
              {/* Dialog header */}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <AlertTriangle
                    size={23}
                    aria-hidden="true"
                  />
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isDeleting}
                  aria-label="Close confirmation dialog"
                  className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X
                    size={19}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Dialog title */}
              <h2
                id="delete-event-title"
                className="mt-5 text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Delete this event?
              </h2>

              {/* Warning description */}
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

              {/* API error feedback */}
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
                {/* Cancel */}
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={closeDialog}
                  disabled={isDeleting}
                  className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                {/* Confirm Delete */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Trash2
                      size={16}
                      aria-hidden="true"
                    />
                  )}

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
