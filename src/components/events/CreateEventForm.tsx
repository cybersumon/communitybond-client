
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

type ImageSource = "url" | "upload";

type FormValues = {
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
};

const initialValues: FormValues = {
  title: "",
  description: "",
  eventType: "",
  thumbnailUrl: "",
  location: "",
  eventDate: "",
};

const categorySuggestions = [
  "Cleanup",
  "Tree Plantation",
  "Clothing Distribution",
  "Blood Donation",
  "Education",
  "Food Distribution",
  "Community Support",
];

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const maxImageSize = 5 * 1024 * 1024;

const inputClass =
  "w-full rounded-xl border border-(--color-border) " +
  "bg-(--color-background) px-4 py-3 text-sm " +
  "text-(--color-foreground) outline-none transition " +
  "placeholder:text-(--color-muted) " +
  "focus:border-(--color-primary) " +
  "focus:ring-2 focus:ring-emerald-500/15";

const labelClass =
  "mb-2 block text-sm font-semibold text-(--color-foreground)";

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

function getValidImageUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const url = new URL(trimmed);

    return url.protocol === "https:" ? trimmed : "";
  } catch {
    return "";
  }
}

export default function CreateEventForm() {
  const router = useRouter();

  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession();

  const [form, setForm] = useState<FormValues>(
    initialValues
  );

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [imageSource, setImageSource] =
    useState<ImageSource>("url");

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [localPreview, setLocalPreview] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const previewUrlsRef = useRef<Set<string>>(
    new Set()
  );

  const submittingRef = useRef(false);

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      for (const url of previewUrls) {
        URL.revokeObjectURL(url);
      }

      previewUrls.clear();
    };
  }, []);

  function replaceLocalPreview(file: File | null) {
    const previewUrls = previewUrlsRef.current;

    for (const url of previewUrls) {
      URL.revokeObjectURL(url);
    }

    previewUrls.clear();

    if (!file) {
      setLocalPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    previewUrls.add(previewUrl);
    setLocalPreview(previewUrl);
  }

  function updateField(
    field: keyof FormValues,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");

    if (field === "thumbnailUrl") {
      setImageFailed(false);
    }
  }

  function changeImageSource(source: ImageSource) {
    if (submittingRef.current) {
      return;
    }

    setImageSource(source);
    setImageFailed(false);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (submittingRef.current) {
      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setSelectedImage(null);
      replaceLocalPreview(null);
      setImageFailed(false);
      setErrorMessage(
        "Only JPG, PNG and WebP images are allowed."
      );
      event.target.value = "";
      return;
    }

    if (file.size > maxImageSize) {
      setSelectedImage(null);
      replaceLocalPreview(null);
      setImageFailed(false);
      setErrorMessage(
        "Image size must be less than 5 MB."
      );
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    replaceLocalPreview(file);
    setImageFailed(false);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function validateForm(): string {
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

    if (imageSource === "url") {
      if (!getValidImageUrl(thumbnailUrl)) {
        throw new Error(
          "Please enter a valid HTTPS image URL."
        );
      }
    } else if (!selectedImage) {
      throw new Error(
        "Please select an image from your computer."
      );
    }

    return convertEventDate(form.eventDate);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!session?.user) {
        throw new Error(
          "Please sign in before creating an event."
        );
      }

      const eventDate = validateForm();

      submittingRef.current = true;
      setSubmitting(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error(
          "Unable to verify your session. Please sign in again."
        );
      }

      const token = data.token;

      let finalThumbnailUrl = form.thumbnailUrl.trim();

      if (imageSource === "upload") {
        if (!selectedImage) {
          throw new Error("Please select an image.");
        }

        finalThumbnailUrl = await uploadEventImage(
          selectedImage,
          token
        );
      }

      const payload: CreateEventInput = {
        title: form.title.trim(),
        description: form.description.trim(),
        eventType: form.eventType.trim(),
        thumbnailUrl: finalThumbnailUrl,
        location: form.location.trim(),
        eventDate,
      };

      const createdEvent = await createCommunityEvent(
        payload,
        token
      );

      setSuccessMessage(
        "Event created successfully!"
      );

      router.push(`/events/${createdEvent.id}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const externalImageUrl = getValidImageUrl(
    form.thumbnailUrl
  );

  const imagePreviewUrl =
    imageSource === "upload"
      ? localPreview
      : externalImageUrl;

  const showImagePreview =
    Boolean(imagePreviewUrl) && !imageFailed;

  if (sessionLoading) {
    return (
      <div
        role="status"
        className="flex min-h-80 items-center justify-center gap-3 text-sm text-(--color-muted)"
      >
        <LoaderCircle
          size={20}
          className="animate-spin"
          aria-hidden="true"
        />
        Checking your session...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-(--color-border) bg-(--color-surface) p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-primary)/10 text-(--color-primary)">
          <ShieldCheck
            size={26}
            aria-hidden="true"
          />
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
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-(--color-primary) px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-(--color-primary)">
            <Sparkles
              size={15}
              aria-hidden="true"
            />
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
          <ShieldCheck
            size={14}
            aria-hidden="true"
          />
          Verified organizer
        </span>
      </div>

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
            updateField("title", event.target.value)
          }
          placeholder="e.g. Winter Clothes Distribution"
          className={inputClass}
        />

        <p className="mt-1.5 text-right text-xs text-(--color-muted)">
          {form.title.length}/120 characters
        </p>
      </div>

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
            {categorySuggestions.map((category) => (
              <option
                key={category}
                value={category}
              />
            ))}
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
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-(--color-muted)"
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

      <div>
        <label
          htmlFor="event-date"
          className={labelClass}
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays
              size={17}
              aria-hidden="true"
            />
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
          <Clock3
            size={14}
            aria-hidden="true"
          />
          Event time uses your local timezone.
        </p>
      </div>

      <div className="space-y-4">
        <label className={labelClass}>
          Event Cover Image *
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => changeImageSource("url")}
            aria-pressed={imageSource === "url"}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              imageSource === "url"
                ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                : "border-(--color-border) text-(--color-foreground)"
            }`}
          >
            <Link2
              size={17}
              aria-hidden="true"
            />
            Image URL
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => changeImageSource("upload")}
            aria-pressed={imageSource === "upload"}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              imageSource === "upload"
                ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                : "border-(--color-border) text-(--color-foreground)"
            }`}
          >
            <UploadCloud
              size={17}
              aria-hidden="true"
            />
            Upload Image
          </button>
        </div>

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
          <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-background) p-6 text-center">
            <UploadCloud
              size={32}
              className="mx-auto text-(--color-primary)"
              aria-hidden="true"
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

        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-background)">
          {showImagePreview ? (
            <Image
              key={imagePreviewUrl}
              src={imagePreviewUrl}
              alt="Event cover preview"
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 800px"
              onError={() => setImageFailed(true)}
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <ImagePlus
                size={34}
                className="text-(--color-muted)"
                aria-hidden="true"
              />

              <p className="text-sm font-semibold text-(--color-foreground)">
                {imageFailed
                  ? "Unable to load this image"
                  : "Event Cover Preview"}
              </p>

              <p className="text-xs text-(--color-muted)">
                {imageFailed
                  ? "Please choose another image."
                  : imageSource === "upload"
                    ? "Choose an image from your computer."
                    : "Enter a direct HTTPS image URL."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-(--color-border) bg-(--color-background) p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
          Event Organizer
        </p>

        <p className="mt-2 text-sm font-bold text-(--color-foreground)">
          {session.user.name || session.user.email}
        </p>

        <p className="mt-1 text-xs text-(--color-muted)">
          Organizer identity is verified by the server.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-300/60 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2
            size={18}
            aria-hidden="true"
          />
          {successMessage}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/upcoming-events"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) px-6 py-3 text-sm font-semibold text-(--color-foreground) transition hover:bg-(--color-background)"
        >
          <ArrowLeft
            size={16}
            aria-hidden="true"
          />
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
                aria-hidden="true"
              />
              Creating Event...
            </>
          ) : (
            <>
              <CalendarDays
                size={18}
                aria-hidden="true"
              />
              Create Event
            </>
          )}
        </button>
      </div>
    </form>
  );
}
