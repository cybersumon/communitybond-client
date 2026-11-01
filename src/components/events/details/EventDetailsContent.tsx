
import type { CommunityEvent } from "@/types/event";

import EventDetailsHero from "./EventDetailsHero";
import EventMissionSection from "./EventMissionSection";
import VolunteerGuidelines from "./VolunteerGuidelines";

/**
 * EventDetailsContent
 *
 * PURPOSE:
 * Assemble the compact event details experience.
 *
 * LAYOUT:
 * Top 50%    -> EventDetailsHero
 * Bottom 50% -> EventMissionSection
 *               VolunteerGuidelines
 *
 * IMPORTANT:
 * The modal routing and hero design remain unchanged.
 */
export default function EventDetailsContent({
  event,
}: {
  event: CommunityEvent;
}) {
  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden bg-(--color-surface)">

      {/* Hero image: retains the existing 50% layout. */}
      <div className="h-1/2 min-h-0 shrink-0">
        <EventDetailsHero event={event} />
      </div>

      {/* Bottom content: only this section is redesigned. */}
      <div className="h-1/2 min-h-0 overflow-y-auto p-4 sm:p-5">

        {/* Premium Minimal Event Mission. */}
        <EventMissionSection event={event} />

        {/* Existing Volunteer Guidelines remain unchanged. */}
        <div className="mt-4 border-t border-(--color-border) pt-4">
          <VolunteerGuidelines />
        </div>
      </div>
    </article>
  );
}
