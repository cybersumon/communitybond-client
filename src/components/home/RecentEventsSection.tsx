
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
} from "lucide-react";

import { getRecentEvents } from "@/lib/api/events";
import EventGrid from "@/components/events/EventGrid";

/**
 * RecentEventsSection
 *
 * PURPOSE:
 * Display the six most recently created
 * upcoming community events on the homepage.
 *
 * DATA SOURCE:
 * GET /api/events/recent
 *
 * SERVER COMPONENT:
 * Fetch events directly on the Next.js server.
 *
 * NAVIGATION:
 * returnTo="/" ensures closing an event modal
 * returns users to the homepage.
 */

export default async function RecentEventsSection() {
  // Fetch the latest six upcoming events.
  const recentEvents = await getRecentEvents();

  return (
    <section
      id="recent-events"
      aria-labelledby="recent-events-heading"
      className="bg-(--color-background) py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading. */}
        <div className="mb-9 flex flex-col gap-5 sm:mb-11 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {/* Section label. */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-4 py-2">
              <HeartHandshake
                size={16}
                className="text-(--color-primary)"
                aria-hidden="true"
              />

              <span className="text-xs font-bold uppercase tracking-widest text-(--color-primary)">
                Make a Difference
              </span>
            </div>

            {/* Section title. */}
            <h2
              id="recent-events-heading"
              className="text-3xl font-extrabold tracking-tight text-(--color-foreground) sm:text-4xl"
            >
              Recent Community Events
            </h2>

            {/* Section description. */}
            <p className="mt-4 max-w-xl text-sm leading-7 text-(--color-muted) sm:text-base">
              Discover meaningful initiatives, connect
              with passionate people, and take part in
              positive change in your community.
            </p>
          </div>

          {/* Explore all events link. */}
          <Link
            href="/upcoming-events"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-(--color-border) bg-(--color-surface) px-5 py-3 text-sm font-bold text-(--color-foreground) transition hover:border-(--color-primary) hover:text-(--color-primary)"
          >
            Explore All Events

            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Database-driven event grid. */}
        {recentEvents.length > 0 ? (
          <EventGrid
            events={recentEvents}
            returnTo="/"
          />
        ) : (
          <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-primary)/10 text-(--color-primary)">
              <CalendarDays
                size={26}
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-5 text-xl font-bold text-(--color-foreground)">
              No upcoming events yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-(--color-muted)">
              Be the first to organize an initiative
              that brings your community together.
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Create an Event
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {/* Mobile-friendly secondary navigation. */}
        {recentEvents.length > 0 && (
          <div className="mt-9 text-center sm:hidden">
            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 text-sm font-bold text-(--color-primary)"
            >
              View All Events

              <ArrowRight
                size={17}
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
