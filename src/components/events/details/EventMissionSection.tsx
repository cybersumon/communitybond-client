
import { HandHeart, Users } from "lucide-react";

import type { CommunityEvent } from "@/types/event";

import JoinEventButton from "@/components/events/details/JoinEventButton";

type EventMissionSectionProps = {
  event: CommunityEvent;
};

export default function EventMissionSection({
  event,
}: EventMissionSectionProps) {
  return (
    <section aria-labelledby="event-mission-title">
      {/* Event mission content and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Left: Mission information */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--color-primary)">
            The Community Mission
          </p>

          <h2
            id="event-mission-title"
            className="mt-1.5 text-lg font-extrabold tracking-tight text-(--color-foreground) sm:text-xl"
          >
            Make Every Action Count.
          </h2>

          <p className="mt-2 whitespace-pre-line text-sm leading-5 text-(--color-muted)">
            {event.description}
          </p>
        </div>

        {/* Right: Compact action buttons */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <JoinEventButton
            eventId={event.id}
            organizerId={event.organizer.id}
            eventDate={event.eventDate}
          />

          {/* Future donation functionality */}
          <button
            type="button"
            disabled
            title="Donation functionality is not available yet"
            aria-label="Donate to this initiative"
            className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-primary) opacity-65"
          >
            <HandHeart
              size={18}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Supportive footer */}
      <div className="mt-4 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <Users
          size={16}
          aria-hidden="true"
          className="shrink-0 text-(--color-primary)"
        />

        <p className="text-xs leading-5 text-(--color-muted)">
          Join local volunteers and support a shared purpose.
        </p>
      </div>
    </section>
  );
}
