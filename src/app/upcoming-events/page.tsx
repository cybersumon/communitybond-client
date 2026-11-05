
import { getEvents } from "@/lib/api/events";
import EventsExplorer from "@/components/events/EventsExplorer";

export default async function UpcomingEventsPage() {
  // Get real upcoming events from MongoDB.
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-(--color-background)">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-sm font-semibold text-(--color-primary)">
            Explore Opportunities
          </p>

          <h1 className="mt-3 text-3xl font-bold text-(--color-foreground)">
            Upcoming Events
          </h1>

          <p className="mt-3 text-(--color-muted)">
            Discover community initiatives and find meaningful
            ways to make a difference.
          </p>
        </div>

        {/* Pass real data to the existing interactive explorer. */}
        <EventsExplorer events={events} />
      </div>
    </main>
  );
}
