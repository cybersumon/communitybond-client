
import Link from "next/link";
import { notFound } from "next/navigation";
import { X } from "lucide-react";

import { demoEvents } from "@/data/demoEvents";
import EventDetailsContent from "@/components/events/details/EventDetailsContent";

/**
 * EventModalPage
 *
 * PURPOSE:
 * Display a selected event in a stable popup.
 *
 * WHY:
 * Test 2 proved that a simple fixed overlay works.
 * We therefore avoid the problematic EventDetailsModal
 * component and its automatic close/navigation logic.
 *
 * HOW:
 * - Read the event ID from the URL.
 * - Find the matching event.
 * - Render a fixed overlay above the existing page.
 * - Use a normal Next.js Link to close the popup.
 */
export default async function EventModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Get the event ID from the dynamic route.
  const { id } = await params;

  // Find the selected event in our temporary demo data.
  const event = demoEvents.find((item) => item.id === id);

  // Show a 404 if the requested event does not exist.
  if (!event) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5">

      {/* Main popup window, maximum width 800px. */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${event.title}`}
        className="relative h-[80dvh] max-h-180 w-full max-w-200 overflow-hidden rounded-3xl bg-(--color-surface) text-(--color-foreground) shadow-2xl"
      >
        {/* Reusable event details component. */}
        <div className="h-full">
          <EventDetailsContent event={event} />
        </div>

        {/* Close using a normal route link.
            No router.back(), effects or automatic closing. */}
        <Link
          href="/upcoming-events"
          scroll={false}
          aria-label="Close event details"
          className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-black/75"
        >
          <X size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
