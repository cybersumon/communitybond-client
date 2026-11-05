
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { updateEventApi } from "@/lib/api/update-event";



type EditableEvent = {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
  organizer: {
    id: string;
    name: string;
  };
};

type FormValues = {
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
};

type LoadState = {
  eventId: string;
  userId: string;
  status: "success" | "error";
  message: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001";


function toLocalDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 16);
}


const initialForm: FormValues = {
  title: "",
  description: "",
  eventType: "",
  thumbnailUrl: "",
  location: "",
  eventDate: "",
};


const inputClass =
  "w-full rounded-xl border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm text-(--color-foreground) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-emerald-500/10";


function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold text-(--color-foreground)">
        {label}
      </span>

      {children}
    </label>
  );
}

/**
 * Main Edit Event Component.
 */
export default function EditEventForm({
  eventId,
}: {
  eventId: string;
}) {
  const router = useRouter();

  /**
   * Better Auth session information.
   */
  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  
  const userId = session?.user?.id;

  /**
   * Form states.
   */
  const [form, setForm] = useState<FormValues>(
    initialForm
  );

  const [loadState, setLoadState] =
    useState<LoadState | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 
  useEffect(() => {
    if (sessionPending || !userId) {
      return;
    }

   
    const authenticatedUserId: string = userId;

    const controller = new AbortController();

    async function loadEvent() {
      try {
        /**
         * Load the existing event.
         */
        const response = await fetch(
          `${API_BASE_URL}/api/events/${eventId}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load event information."
          );
        }

        const result = await response.json();

        if (controller.signal.aborted) {
          return;
        }

        const event = result.data as EditableEvent;

        if (!event || !event.organizer) {
          throw new Error(
            "Invalid event information received."
          );
        }

        
        if (
          event.organizer.id !== authenticatedUserId
        ) {
          throw new Error(
            "You are not allowed to edit this event."
          );
        }

        /**
         * Populate the form.
         */
        setForm({
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          thumbnailUrl: event.thumbnailUrl,
          location: event.location,
          eventDate: toLocalDateTime(
            event.eventDate
          ),
        });

        /**
         * Mark this event as successfully loaded.
         */
        setLoadState({
          eventId,
          userId: authenticatedUserId,
          status: "success",
          message: "",
        });
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setLoadState({
          eventId,
          userId: authenticatedUserId,
          status: "error",
          message:
            err instanceof Error
              ? err.message
              : "Failed to load event.",
        });
      }
    }

    void loadEvent();

    /**
     * Cancel previous requests when the event
     * or authenticated user changes.
     */
    return () => {
      controller.abort();
    };
  }, [eventId, userId, sessionPending]);

  /**
   * Update individual form fields.
   */
  function updateField(
    field: keyof FormValues,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  /**
   * Submit the updated event.
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving || !userId) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      /**
       * Retrieve JWT token from Better Auth.
       */
      const tokenResponse = await authClient.token();

      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      /**
       * Validate event date.
       */
      const parsedDate = new Date(form.eventDate);

      if (Number.isNaN(parsedDate.getTime())) {
        throw new Error(
          "Please enter a valid event date."
        );
      }

      /**
       * Send the updated event details to the API.
       */
      await updateEventApi(
        eventId,
        {
          title: form.title,
          description: form.description,
          eventType: form.eventType,
          thumbnailUrl: form.thumbnailUrl,
          location: form.location,
          eventDate: parsedDate.toISOString(),
        },
        token
      );

      setSuccess("Event updated successfully!");

      /**
       * Navigate back to My Events.
       */
      router.push("/my-events");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update event."
      );
    } finally {
      setSaving(false);
    }
  }

  /**
   * Authentication loading state.
   */
  if (sessionPending) {
    return (
      <div className="py-24 text-center text-sm text-(--color-muted)">
        Checking your session...
      </div>
    );
  }

  /**
   * Guest state.
   *
   * No setState is necessary inside useEffect.
   */
  if (!userId) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h2 className="text-xl font-bold text-(--color-foreground)">
          Sign in required
        </h2>

        <p className="mt-3 text-sm text-(--color-muted)">
          Please log in to edit this event.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  /**
   * Prevent showing stale event information
   * when eventId or userId changes.
   */
  const isCurrentLoad =
    loadState?.eventId === eventId &&
    loadState?.userId === userId;

  /**
   * Event loading state.
   */
  if (!isCurrentLoad) {
    return (
      <div className="flex min-h-72 items-center justify-center py-24 text-center text-sm text-(--color-muted)">
        Loading event information...
      </div>
    );
  }

  /**
   * Event loading or permission error.
   */
  if (loadState.status === "error") {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h2 className="text-xl font-bold text-(--color-foreground)">
          Unable to edit event
        </h2>

        <p
          role="alert"
          className="mt-3 text-sm text-red-500"
        >
          {loadState.message}
        </p>

        <Link
          href="/my-events"
          className="mt-6 inline-flex text-sm font-semibold text-(--color-primary) hover:underline"
        >
          Back to My Events
        </Link>
      </div>
    );
  }

  /**
   * Editable event form.
   */
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm sm:p-8"
    >
      {/* Form heading */}
      <div>
        <h2 className="text-xl font-bold text-(--color-foreground)">
          Edit Event Details
        </h2>

        <p className="mt-2 text-sm text-(--color-muted)">
          Update your event information below.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300"
        >
          {success}
        </div>
      )}

      {/* Event Title */}
      <Field label="Event Title">
        <input
          required
          minLength={5}
          maxLength={120}
          value={form.title}
          onChange={(event) =>
            updateField("title", event.target.value)
          }
          className={inputClass}
        />
      </Field>

      {/* Description */}
      <Field label="Description">
        <textarea
          required
          rows={5}
          minLength={20}
          maxLength={5000}
          value={form.description}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value
            )
          }
          className={inputClass}
        />
      </Field>

      {/* Event Category */}
      <Field label="Event Category">
        <input
          required
          minLength={2}
          maxLength={60}
          value={form.eventType}
          onChange={(event) =>
            updateField(
              "eventType",
              event.target.value
            )
          }
          className={inputClass}
        />
      </Field>

      {/* Event Location */}
      <Field label="Location">
        <input
          required
          minLength={3}
          maxLength={200}
          value={form.location}
          onChange={(event) =>
            updateField(
              "location",
              event.target.value
            )
          }
          className={inputClass}
        />
      </Field>

      {/* Event Date */}
      <Field label="Event Date & Time">
        <input
          required
          type="datetime-local"
          value={form.eventDate}
          onChange={(event) =>
            updateField(
              "eventDate",
              event.target.value
            )
          }
          className={inputClass}
        />
      </Field>

      {/* Image URL */}
      <Field label="Image URL">
        <input
          required
          type="url"
          value={form.thumbnailUrl}
          onChange={(event) =>
            updateField(
              "thumbnailUrl",
              event.target.value
            )
          }
          className={inputClass}
        />

        <p className="mt-2 text-xs leading-5 text-(--color-muted)">
          Use a direct HTTPS image URL or an existing
          CommunityBond upload URL.
        </p>
      </Field>

      {/* Event image preview */}
      {form.thumbnailUrl && (
        <div className="overflow-hidden rounded-xl border border-(--color-border)">
          {/* Existing image preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={form.thumbnailUrl}
            alt="Event preview"
            className="h-52 w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Form buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-(--color-border) pt-6">
        <Link
          href="/my-events"
          className="rounded-xl border border-(--color-border) px-5 py-3 text-sm font-semibold text-(--color-foreground) transition hover:bg-(--color-background)"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-xl bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
