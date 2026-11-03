
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImagePlus,
  Link2,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  createCommunityEvent,
  type CreateEventInput,
} from "@/lib/api/create-event";

import { uploadEventImage } from "@/lib/api/upload-image";

/**
 * CreateEventForm
 *
 * PURPOSE:
 * Create a community event using the Express API.
 *
 * FEATURES:
 * - External image URL
 * - Local computer image upload
 * - Image preview
 * - Form validation
 * - JWT authentication
 * - MongoDB event creation
 * - Redirect after successful creation
 *
 * SECURITY:
 * - Organizer identity comes from verified JWT.
 * - User cannot submit a custom organizer ID.
 * - Image uploads require authentication.
 */

// -------------------------------------------
// TYPES
// -------------------------------------------

type ImageSource = "url" | "upload";

type FormValues = {
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
};

// -------------------------------------------
// INITIAL FORM VALUES
// -------------------------------------------

const initialValues: FormValues = {
  title: "",
  description: "",
  eventType: "",
  thumbnailUrl: "",
  location: "",
  eventDate: "",
};

// -------------------------------------------
// EVENT CATEGORIES
// -------------------------------------------

const categorySuggestions = [
  "Cleanup",
  "Tree Plantation",
  "Clothing Distribution",
  "Blood Donation",
  "Education",
  "Food Distribution",
  "Community Support",
];

// -------------------------------------------
// SHARED STYLES
// -------------------------------------------

const inputClass =
  "w-full rounded-xl border border-(--color-border) " +
  "bg-(--color-background) px-4 py-3 text-sm " +
  "text-(--color-foreground) outline-none transition " +
  "placeholder:text-(--color-muted) " +
  "focus:border-(--color-primary) " +
  "focus:ring-2 focus:ring-(--color-primary)/15";

const labelClass =
  "mb-2 block text-sm font-semibold text-(--color-foreground)";

// -------------------------------------------
// MAIN COMPONENT
// -------------------------------------------

export default function CreateEventForm() {
  const router = useRouter();

  /**
   * Better Auth session.
   */
  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession();

  // -----------------------------------------
  // FORM STATE
  // -----------------------------------------

  const [form, setForm] = useState<FormValues>(
    initialValues
  );

  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // -----------------------------------------
  // IMAGE STATE
  // -----------------------------------------

  // URL or local computer upload.
  const [imageSource, setImageSource] =
    useState<ImageSource>("url");

  // Selected computer image.
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  // Temporary browser preview URL.
  const [localPreview, setLocalPreview] =
    useState("");

  // Image loading error state.
  const [imageFailed, setImageFailed] =
    useState(false);

  // -----------------------------------------
  // IMAGE PREVIEW EFFECT
  // -----------------------------------------

  /**
   * Create a temporary preview URL for
   * the selected local image.
   *
   * Cleanup prevents browser memory leaks.
   */
  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    const previewUrl =
      URL.createObjectURL(selectedImage);

    setLocalPreview(previewUrl);
    setImageFailed(false);

    return () => {
      URL.revokeObjectURL(previewUrl);
      setLocalPreview("");
    };
  }, [selectedImage]);

  // -----------------------------------------
  // UPDATE FORM FIELDS
  // -----------------------------------------

  /**
   * Update a form value without page reload.
   */
  function updateField(
    field: keyof FormValues,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrorMessage("");

    if (field === "thumbnailUrl") {
      setImageFailed(false);
    }
  }

  // -----------------------------------------
  // HANDLE IMAGE SOURCE CHANGE
  // -----------------------------------------

  function changeImageSource(source: ImageSource) {
    if (submitting) return;

    setImageSource(source);
    setImageFailed(false);
    setErrorMessage("");
  }

  // -----------------------------------------
  // HANDLE LOCAL IMAGE SELECTION
  // -----------------------------------------

  /**
   * Accept only JPG, PNG or WebP files
   * with a maximum size of 5 MB.
   *
   * Server validates the file again.
   */
  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedImage(null);
      setErrorMessage(
        "Only JPG, PNG and WebP images are allowed."
      );
      event.target.value = "";
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setSelectedImage(null);
      setErrorMessage(
        "Image size must be less than 5 MB."
      );
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImageFailed(false);
    setErrorMessage("");
  }

  // -----------------------------------------
  // VALIDATE EVENT DATE
  // -----------------------------------------

  /**
   * Convert HTML datetime-local into
   * an ISO date accepted by Express.
   *
   * Browser local time is converted to UTC.
   */
  function convertEventDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new Error(
        "Please select a valid event date and time."
      );
    }

    if (date.getTime() <= Date.now()) {
      throw new Error(
        "Event date and time must be in the future."
      );
    }

    return date.toISOString();
  }

  // -----------------------------------------
  // VALIDATE FORM
  // -----------------------------------------

  /**
   * Client-side validation for better UX.
   *
   * Express Zod validation is authoritative.
   */
  function validateForm() {
    const title = form.title.trim();
    const description = form.description.trim();
    const eventType = form.eventType.trim();
    const location = form.location.trim();
    const thumbnailUrl = form.thumbnailUrl.trim();

    if (title.length < 5 || title.length > 120) {
      throw new Error(
        "Event title must contain 5–120 characters."
      );
    }

    if (
      description.length < 20 ||
      description.length > 5000
    ) {
      throw new Error(
        "Description must contain 20–5000 characters."
      );
    }

    if (
      eventType.length < 2 ||
      eventType.length > 60
    ) {
      throw new Error(
        "Please enter a valid event category."
      );
    }

    if (
      location.length < 3 ||
      location.length > 200
    ) {
      throw new Error(
        "Location must contain 3–200 characters."
      );
    }

    /**
     * Validate image based on selected source.
     */
    if (imageSource === "url") {
      try {
        const url = new URL(thumbnailUrl);

        if (url.protocol !== "https:") {
          throw new Error("Invalid protocol");
        }
      } catch {
        throw new Error(
          "Please enter a valid HTTPS image URL."
        );
      }
    } else {
      if (!selectedImage) {
        throw new Error(
          "Please select an image from your computer."
        );
      }
    }

    // Validate future event date.
    convertEventDate(form.eventDate);
  }

  // -----------------------------------------
  // SUBMIT EVENT
  // -----------------------------------------

  /**
   * Submit workflow:
   *
   * 1. Check user session.
   * 2. Validate form.
   * 3. Request JWT.
   * 4. Upload image when necessary.
   * 5. Submit event to Express.
   * 6. Redirect to event details.
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Authentication required.
      if (!session?.user) {
        throw new Error(
          "Please sign in before creating an event."
        );
      }

      // Validate user input.
      validateForm();

      setSubmitting(true);

      // Get JWT from Better Auth.
      const {
        data,
        error,
      } = await authClient.token();

      if (error || !data?.token) {
        throw new Error(
          "Unable to verify your session. Please sign in again."
        );
      }

      /**
       * Resolve the final image URL.
       *
       * URL mode:
       *   Use user's external image URL.
       *
       * Upload mode:
       *   Upload file to Express first.
       *   Use the returned public image URL.
       */
      let finalThumbnailUrl =
        form.thumbnailUrl.trim();

      if (imageSource === "upload") {
        if (!selectedImage) {
          throw new Error(
            "Please select an image."
          );
        }

        finalThumbnailUrl =
          await uploadEventImage(
            selectedImage,
            data.token
          );
      }

      /**
       * Build event payload.
       *
       * Never send organizer ID or createdAt.
       * Express creates those fields.
       */
      const payload: CreateEventInput = {
        title: form.title.trim(),
        description: form.description.trim(),
        eventType: form.eventType.trim(),
        thumbnailUrl: finalThumbnailUrl,
        location: form.location.trim(),
        eventDate: convertEventDate(
          form.eventDate
        ),
      };

      // Send event data to Express API.
      const createdEvent =
        await createCommunityEvent(
          payload,
          data.token
        );

      setSuccessMessage(
        "Event created successfully!"
      );

      // Navigate to created event details.
      router.push(
        `/events/${createdEvent.id}`
      );

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // -----------------------------------------
  // CHECK SESSION
  // -----------------------------------------

  if (sessionLoading) {
    return (
      <div
        role="status"
        className="flex min-h-80 items-center justify-center gap-3 text-sm text-(--color-muted)"
      >
        <LoaderCircle
          size={20}
          className="animate-spin"
        />

        Checking your session...
      </div>
    );
  }

  // -----------------------------------------
  // NOT AUTHENTICATED
  // -----------------------------------------

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-primary)/10 text-(--color-primary)">
          <ShieldCheck size={26} />
        </div>

        <h2 className="text-2xl font-bold text-(--color-foreground)">
          Sign in to create an event
        </h2>

        <p className="mt-3 text-sm leading-6 text-(--color-muted)">
          Join CommunityBond to organize meaningful
          activities for your community.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-(--color-primary) px-6 py-3 text-sm font-bold text-white"
        >
          Sign in
        </Link>
      </div>
    );
  }

  // -----------------------------------------
  // IMAGE PREVIEW SOURCE
  // -----------------------------------------

  const externalImageUrl =
    form.thumbnailUrl.trim();

  let validExternalUrl = false;

  try {
    validExternalUrl =
      new URL(externalImageUrl).protocol ===
      "https:";
  } catch {
    validExternalUrl = false;
  }

  const imagePreviewUrl =
    imageSource === "upload"
      ? localPreview
      : validExternalUrl
        ? externalImageUrl
        : "";

  const showImagePreview =
    Boolean(imagePreviewUrl) &&
    !imageFailed;

  // -----------------------------------------
  // FORM UI
  // -----------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
    >
      {/* Section heading. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-(--color-primary)">
            <Sparkles size={15} />
            Community Initiative
          </p>

          <h2 className="mt-2 text-xl font-bold text-(--color-foreground)">
            Event Information
          </h2>

          <p className="mt-1 text-sm text-(--color-muted)">
            Tell your community about the event.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-(--color-border) px-3 py-1.5 text-xs text-(--color-muted)">
          <ShieldCheck size={14} />
          Verified organizer
        </span>
      </div>

      {/* Event Title. */}
      <div>
        <label
          htmlFor="event-title"
          className={labelClass}
        >
          Event Title *
        </label>

        <input
          id="event-title"
          type="text"
          required
          minLength={5}
          maxLength={120}
          disabled={submitting}
          value={form.title}
          onChange={(event) =>
            updateField(
              "title",
              event.target.value
            )
          }
          placeholder="e.g. Winter Clothes Distribution"
          className={inputClass}
        />

        <p className="mt-1.5 text-right text-xs text-(--color-muted)">
          {form.title.length}/120 characters
        </p>
      </div>

      {/* Event Description. */}
      <div>
        <label
          htmlFor="event-description"
          className={labelClass}
        >
          Event Description *
        </label>

        <textarea
          id="event-description"
          required
          minLength={20}
          maxLength={5000}
          rows={5}
          disabled={submitting}
          value={form.description}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value
            )
          }
          placeholder="Describe the event purpose and how volunteers can help..."
          className={`${inputClass} resize-y`}
        />

        <p className="mt-1.5 text-right text-xs text-(--color-muted)">
          {form.description.length}/5000 characters
        </p>
      </div>

      {/* Category and Location. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="event-category"
            className={labelClass}
          >
            Event Category *
          </label>

          <input
            id="event-category"
            type="text"
            list="event-category-suggestions"
            required
            minLength={2}
            maxLength={60}
            disabled={submitting}
            value={form.eventType}
            onChange={(event) =>
              updateField(
                "eventType",
                event.target.value
              )
            }
            placeholder="Choose or enter category"
            className={inputClass}
          />

          <datalist id="event-category-suggestions">
            {categorySuggestions.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                />
              )
            )}
          </datalist>
        </div>

        <div>
          <label
            htmlFor="event-location"
            className={labelClass}
          >
            Location *
          </label>

          <div className="relative">
            <MapPin
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-muted)"
            />

            <input
              id="event-location"
              type="text"
              required
              minLength={3}
              maxLength={200}
              disabled={submitting}
              value={form.location}
              onChange={(event) =>
                updateField(
                  "location",
                  event.target.value
                )
              }
              placeholder="e.g. Mohammadpur, Dhaka"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>
      </div>

      {/* Event Date and Time. */}
      <div>
        <label
          htmlFor="event-date"
          className={labelClass}
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={17} />
            Event Date & Time *
          </span>
        </label>

        <input
          id="event-date"
          type="datetime-local"
          required
          disabled={submitting}
          value={form.eventDate}
          onChange={(event) =>
            updateField(
              "eventDate",
              event.target.value
            )
          }
          className={inputClass}
        />

        <p className="mt-2 flex items-center gap-2 text-xs text-(--color-muted)">
          <Clock3 size={14} />
          Event time uses your local timezone.
        </p>
      </div>

      {/* Image Source Selection. */}
      <div className="space-y-4">
        <label className={labelClass}>
          Event Cover Image *
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* External URL option. */}
          <button
            type="button"
            disabled={submitting}
            onClick={() =>
              changeImageSource("url")
            }
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              imageSource === "url"
                ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                : "border-(--color-border) text-(--color-foreground)"
            }`}
          >
            <Link2 size={17} />
            Image URL
          </button>

          {/* Computer upload option. */}
          <button
            type="button"
            disabled={submitting}
            onClick={() =>
              changeImageSource("upload")
            }
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              imageSource === "upload"
                ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                : "border-(--color-border) text-(--color-foreground)"
            }`}
          >
            <UploadCloud size={17} />
            Upload Image
          </button>
        </div>

        {/* Image URL input. */}
        {imageSource === "url" ? (
          <div>
            <label
              htmlFor="event-image-url"
              className={labelClass}
            >
              Direct Image URL
            </label>

            <input
              id="event-image-url"
              type="url"
              required
              disabled={submitting}
              value={form.thumbnailUrl}
              onChange={(event) =>
                updateField(
                  "thumbnailUrl",
                  event.target.value
                )
              }
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />

            <p className="mt-2 text-xs text-(--color-muted)">
              Paste a public HTTPS direct image URL.
              Some websites may block external embedding.
            </p>
          </div>
        ) : (
          /* Local computer upload input. */
          <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-background) p-6 text-center">
            <UploadCloud
              size={32}
              className="mx-auto text-(--color-primary)"
            />

            <label
              htmlFor="event-image-file"
              className="mt-3 block cursor-pointer text-sm font-semibold text-(--color-primary)"
            >
              Choose image from your computer
            </label>

            <input
              id="event-image-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={submitting}
              onChange={handleImageSelection}
              className="mt-3 block w-full cursor-pointer text-xs text-(--color-muted) file:mr-3 file:rounded-lg file:border-0 file:bg-(--color-primary)/10 file:px-3 file:py-2 file:font-semibold file:text-(--color-primary)"
            />

            <p className="mt-2 text-xs text-(--color-muted)">
              JPG, PNG or WebP — Maximum 5 MB
            </p>

            {selectedImage && (
              <p className="mt-3 break-all text-sm font-medium text-(--color-foreground)">
                Selected: {selectedImage.name}
              </p>
            )}
          </div>
        )}

        {/* Live Image Preview. */}
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-background)">
          {showImagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={imagePreviewUrl}
              src={imagePreviewUrl}
              alt="Event cover preview"
              onError={() =>
                setImageFailed(true)
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <ImagePlus
                size={34}
                className="text-(--color-muted)"
              />

              <p className="text-sm font-semibold text-(--color-foreground)">
                {imageFailed
                  ? "Unable to load this image"
                  : "Event Cover Preview"}
              </p>

              <p className="text-xs text-(--color-muted)">
                {imageSource === "upload"
                  ? "Choose an image from your computer."
                  : "Enter a direct HTTPS image URL."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Organizer Information. */}
      <div className="rounded-2xl border border-(--color-border) bg-(--color-background) p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
          Event Organizer
        </p>

        <p className="mt-2 text-sm font-bold text-(--color-foreground)">
          {session.user.name}
        </p>

        <p className="mt-1 text-xs text-(--color-muted)">
          Organizer identity is verified by the server.
        </p>
      </div>

      {/* Error Message. */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-300/60 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {/* Success Message. */}
      {successMessage && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 size={18} />
          {successMessage}
        </p>
      )}

      {/* Form Actions. */}
      <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/upcoming-events"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) px-6 py-3 text-sm font-semibold text-(--color-foreground) transition hover:bg-(--color-background)"
        >
          <ArrowLeft size={16} />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-7 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
              Creating Event...
            </>
          ) : (
            <>
              <CalendarDays size={18} />
              Create Event
            </>
          )}
        </button>
      </div>
    </form>
  );
}
