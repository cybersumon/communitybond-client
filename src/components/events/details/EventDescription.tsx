
import type { CommunityEvent } from "@/types/event";
import EventOrganizer from "../EventOrganizer";

/**
 * EventDescription
 *
 * PURPOSE:
 * Show full event information and organizer details.
 *
 * HOW:
 * Receives an event from its parent component.
 * Reuses the existing EventOrganizer component.
 */
type EventDescriptionProps = {
  event: CommunityEvent;
};

export default function EventDescription({
  event,
}: EventDescriptionProps) {
  return (
    <section aria-labelledby="about-event-heading">
      {/* Main description heading. */}
      <h2
        id="about-event-heading"
        className="text-2xl font-bold text-(--color-foreground)"
      >
        About This Event
      </h2>

      {/* Preserve line breaks written in event descriptions. */}
      <p className="mt-5 whitespace-pre-line text-base leading-7 text-(--color-muted)">
        {event.description}
      </p>

      {/* Separator between description and organizer. */}
      <div className="my-9 border-t border-(--color-border)" />

      {/* Reuse the organizer display from EventCard. */}
      <h3 className="mb-5 text-lg font-bold text-(--color-foreground)">
        Event Organizer
      </h3>

      <EventOrganizer organizer={event.organizer} />
    </section>
  );
}
