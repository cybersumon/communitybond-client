
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { demoEvents } from "@/data/demoEvents";
import EventDetailsContent from "@/components/events/details/EventDetailsContent";

/**
 * EventDetailsPage
 *
 * PURPOSE:
 * The canonical route for /events/[id].
 *
 * WHY:
 * Next.js requires a regular event details page
 * even when an intercepted modal route exists.
 *
 * BEHAVIOR:
 * - Direct URL: renders the full details page.
 * - Browser refresh: renders this canonical page.
 * - Unknown ID: displays Next.js 404.
 *
 * NOTE:
 * Demo data will be replaced with MongoDB-backed
 * API data in a later lesson.
 */

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  // Read the event ID from the dynamic URL.
  const { id } = await params;

  // Find the requested event in temporary demo data.
  const event = demoEvents.find(
    (item) => item.id === id
  );

  // Return a proper 404 when the event does not exist.
  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-(--color-background) px-4 py-8 sm:py-12">

      {/* Center the event details page content. */}
      <div className="mx-auto w-full max-w-205">

        {/* Navigation back to the events listing. */}
        <Link
          href="/upcoming-events"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary) transition-opacity hover:opacity-75"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Upcoming Events
        </Link>

        {/* Shared compact event details presentation.
            A defined height allows its 50/50 layout
            to work on direct page visits as well. */}
        <div className="h-[80dvh] min-h-125 max-h-180 overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-xl">
          <EventDetailsContent event={event} />
        </div>

      </div>
    </main>
  );
}
