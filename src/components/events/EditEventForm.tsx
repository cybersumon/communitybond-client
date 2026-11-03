
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { updateEventApi } from "@/lib/api/update-event";

/**
 * Edit Event Form
 *
 * PURPOSE:
 * Allow event organizers to update their events.
 *
 * SECURITY:
 * - Requires a logged-in session.
 * - Uses Better Auth JWT.
 * - Backend verifies event ownership.
 */

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001";

/**
 * Convert an ISO datetime to a datetime-local value.
 *
 * datetime-local uses the browser's local time,
 * while the API uses ISO datetimes.
 */
function toLocalDateTime(isoDate: string) {
  const date = new Date(isoDate);

  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 16);
}

export default function EditEventForm({
  eventId,
}: {
  eventId: string;
}) {
  const router = useRouter();

  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const [form, setForm] = useState<FormValues>({
    title: "",
    description: "",
    eventType: "",
    thumbnailUrl: "",
    location: "",
    eventDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load the event after authentication is ready.
  useEffect(() => {
    if (sessionPending) return;

    if (!session?.user) {
      setError("Please log in to edit this event.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/events/${eventId}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load event.");
        }

        const result = await response.json();
        const event = result.data as EditableEvent;

        // Frontend ownership check for user experience.
        // The backend performs the authoritative check.
        if (event.organizer.id !== session!.user.id) {
          throw new Error(
            "You are not allowed to edit this event."
          );
        }

        if (controller.signal.aborted) return;

        setForm({
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          thumbnailUrl: event.thumbnailUrl,
          location: event.location,
          eventDate: toLocalDateTime(event.eventDate),
        });
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load event."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadEvent();

    return () => controller.abort();
  }, [eventId, session?.user?.id, sessionPending]);

  /**
   * Update a field without reloading the page.
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
   * Submit changes using the verified JWT.
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      await updateEventApi(
        eventId,
        {
          title: form.title,
          description: form.description,
          eventType: form.eventType,
          thumbnailUrl: form.thumbnailUrl,
          location: form.location,
          eventDate: new Date(
            form.eventDate
          ).toISOString(),
        },
        token
      );

      setSuccess("Event updated successfully!");

      router.refresh();

      // Navigate to My Events after saving.
      router.push("/my-events");
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

  if (loading || sessionPending) {
    return (
      <div className="py-24 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading event information...
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h2 className="text-xl font-semibold">
          Unable to edit event
        </h2>

        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>

        <Link
          href="/my-events"
          className="mt-6 inline-block text-sm font-semibold text-blue-600"
        >
          Back to My Events
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Edit Event Details
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Update your event information below.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300"
        >
          {success}
        </div>
      )}

      <Field label="Event Title">
        <input
          required
          minLength={5}
          maxLength={120}
          value={form.title}
          onChange={(e) =>
            updateField("title", e.target.value)
          }
          className={inputClass}
        />
      </Field>

      <Field label="Description">
        <textarea
          required
          rows={5}
          minLength={20}
          maxLength={5000}
          value={form.description}
          onChange={(e) =>
            updateField("description", e.target.value)
          }
          className={inputClass}
        />
      </Field>

      <Field label="Event Category">
        <input
          required
          minLength={2}
          maxLength={60}
          value={form.eventType}
          onChange={(e) =>
            updateField("eventType", e.target.value)
          }
          className={inputClass}
        />
      </Field>

      <Field label="Location">
        <input
          required
          minLength={3}
          maxLength={200}
          value={form.location}
          onChange={(e) =>
            updateField("location", e.target.value)
          }
          className={inputClass}
        />
      </Field>

      <Field label="Event Date & Time">
        <input
          required
          type="datetime-local"
          value={form.eventDate}
          onChange={(e) =>
            updateField("eventDate", e.target.value)
          }
          className={inputClass}
        />
      </Field>

      <Field label="Image URL">
        <input
          required
          type="url"
          value={form.thumbnailUrl}
          onChange={(e) =>
            updateField("thumbnailUrl", e.target.value)
          }
          className={inputClass}
        />

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Use a direct HTTPS image URL or an existing
          CommunityBond upload URL.
        </p>
      </Field>

      {form.thumbnailUrl && (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          {/* Browser preview of the selected URL. */}
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

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
        <Link
          href="/my-events"
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// Shared input styling.
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

// Reusable form label.
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>

      {children}
    </label>
  );
}
