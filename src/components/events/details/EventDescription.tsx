
import type { CommunityEvent } from "@/types/event";
import EventOrganizer from "../EventOrganizer";


type EventDescriptionProps = {
  event: CommunityEvent;
};

export default function EventDescription({
  event,
}: EventDescriptionProps) {
  return (
    <section aria-labelledby="about-event-heading">
      
      <h2
        id="about-event-heading"
        className="text-2xl font-bold text-(--color-foreground)"
      >
        About This Event
      </h2>

     
      <p className="mt-5 whitespace-pre-line text-base leading-7 text-(--color-muted)">
        {event.description}
      </p>

    
      <div className="my-9 border-t border-(--color-border)" />

      
      <h3 className="mb-5 text-lg font-bold text-(--color-foreground)">
        Event Organizer
      </h3>

      <EventOrganizer organizer={event.organizer} />
    </section>
  );
}
