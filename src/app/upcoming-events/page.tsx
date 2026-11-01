
import type { Metadata } from "next";

import EventsExplorer from "@/components/events/EventsExplorer";
import { demoEvents } from "@/data/demoEvents";

/**
 * Page metadata used by Next.js for SEO.
 */
export const metadata: Metadata = {
  title: "Upcoming Events | CommunityBond",
  description:
    "Explore upcoming community service and volunteering events.",
};

/**
 * UpcomingEventsPage
 *
 * PURPOSE:
 * Display all future community events.
 *
 * ARCHITECTURE:
 * This page is a Server Component.
 * EventsExplorer is the interactive Client Component.
 *
 * CURRENT PHASE:
 * Uses demo data until the Express API is ready.
 */
export default function UpcomingEventsPage() {
  // Pass one stable timestamp to the interactive explorer.
  const currentTime = new Date().toISOString();

  return (
    <main className="min-h-screen bg-(--color-background)">
      {/* Public page introduction. */}
      <section className="bg-(--color-hero) px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-(--color-primary)">
            Discover & Participate
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-(--color-foreground) sm:text-5xl">
            Explore Community Events
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-(--color-muted)">
            Find opportunities to volunteer, support local
            causes and make a lasting difference.
          </p>
        </div>
      </section>

      {/* Interactive events search and results. */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <EventsExplorer
          events={demoEvents}
          currentTime={currentTime}
        />
      </section>
    </main>
  );
}
