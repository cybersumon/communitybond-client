
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getEventById } from "@/lib/api/events";
import EventDetailsContent from "@/components/events/details/EventDetailsContent";

/**
 * EventDetailsPage
 *
 * PURPOSE:
 * Display a full-page version of an event
 * when accessed directly through its URL.
 *
 * DATA:
 * Loads the selected event from MongoDB
 * through our Express API.
 */
export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Read event ID from the URL.
  const { id } = await params;

  // Fetch real event details.
  const event = await getEventById(id);

  // Return Next.js 404 for an unknown ID.
  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-(--color-background) px-4 py-10 sm:px-6">

      <div className="mx-auto max-w-200">

        {/* Back to upcoming events. */}
        <Link
          href="/upcoming-events"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary) hover:underline"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Upcoming Events
        </Link>

        {/* Reuse the same event details design. */}
        <div className="h-[80dvh] min-h-125 max-h-180 overflow-hidden rounded-3xl bg-(--color-surface) shadow-xl">
          <EventDetailsContent event={event} />
        </div>

      </div>
    </main>
  );
}
