
import { notFound } from "next/navigation";
import { X } from "lucide-react";

import { getEventById } from "@/lib/api/events";
import EventDetailsContent from "@/components/events/details/EventDetailsContent";

import { Suspense } from "react";
import EventModalClose from "@/components/events/details/EventModalClose";

/**
 * EventModalPage
 *
 * PURPOSE:
 * Show real MongoDB event details inside the
 * existing Next.js intercepted modal route.
 *
 * DATA FLOW:
 * Event ID -> Express API -> MongoDB
 * -> EventDetailsContent
 *
 * IMPORTANT:
 * Preserve the stable fixed-overlay approach.
 * No router.back(), useEffect(), or dialog.showModal().
 */
export default async function EventModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Read the MongoDB event ID from the route.
  const { id } = await params;

  // Fetch the selected event from Express API.
  const event = await getEventById(id);

  // Show 404 when the event does not exist.
  if (!event) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5">

      {/* Same stable popup container as before. */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${event.title}`}
        className="relative h-[80dvh] max-h-180 w-full max-w-200 overflow-hidden rounded-3xl bg-(--color-surface) text-(--color-foreground) shadow-2xl"
      >
        {/* Existing hero, mission section and guidelines. */}
        <div className="h-full">
          <EventDetailsContent event={event} />
        </div>

        {/* Close without triggering the old modal blink. */}
        {/* Always-visible close button */}
<div className="absolute right-4 top-4 z-100 sm:right-6 sm:top-6">
  <Suspense fallback={null}>
    <EventModalClose />
  </Suspense>
</div>
      </section>
    </div>
  );
}
