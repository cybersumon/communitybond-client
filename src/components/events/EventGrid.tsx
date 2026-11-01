
import type { CommunityEvent } from "@/types/event";
import EventCard from "./EventCard";

/**
 * EventGrid Props
 *
 * WHY:
 * Receive an array instead of fetching data here.
 * This keeps the Grid reusable with different data sources.
 */
type EventGridProps = {
  events: CommunityEvent[];
};

/**
 * EventGrid
 *
 * PURPOSE:
 * Display multiple event cards responsively.
 *
 * Mobile  -> 1 column
 * Tablet  -> 2 columns
 * Desktop -> 3 columns
 */
export default function EventGrid({ events }: EventGridProps) {
  // Provide a meaningful message for empty data.
  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-12 text-center">
        <h3 className="text-xl font-bold text-(--color-foreground)">
          No upcoming events yet
        </h3>
        <p className="mt-3 text-(--color-muted)">
          New community activities will appear here soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3">
      {/* Render one independent card for each event. */}
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
