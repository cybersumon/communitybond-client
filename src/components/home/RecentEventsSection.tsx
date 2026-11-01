
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import EventGrid from "@/components/events/EventGrid";
import { demoEvents } from "@/data/demoEvents";

/**
 * RecentEventsSection
 *
 * PURPOSE:
 * Display the six most recently created future events.
 *
 * CURRENT PHASE:
 * Uses demo data for frontend design practice.
 *
 * FUTURE:
 * Express + MongoDB will perform this query with
 * .find(), .sort() and .limit(6).
 */
export default function RecentEventsSection() {
  // Get the current time to exclude expired events.
  const now = new Date();

  // Filter upcoming events, sort by creation time,
  // and keep the first six for our temporary demo.
  const recentEvents = demoEvents
    .filter((event) => new Date(event.eventDate) > now)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  return (
    <section className="bg-(--color-hero) px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Reusable section introduction. */}
        <SectionHeading
          label="Find Your Next Opportunity"
          title="Upcoming Community Events"
          description="Join inspiring local initiatives and take part in activities that make a meaningful difference."
        />

        {/* The responsive event card grid. */}
        <EventGrid events={recentEvents} />

        {/* Link to the full upcoming events page. */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 rounded-xl border border-(--color-primary) px-7 py-3 font-semibold text-(--color-primary) transition-colors hover:bg-(--color-surface)"
          >
            Explore All Events
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
