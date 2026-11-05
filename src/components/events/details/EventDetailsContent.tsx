
import type { CommunityEvent } from "@/types/event";

import EventDetailsHero from "./EventDetailsHero";
import EventMissionSection from "./EventMissionSection";
import VolunteerGuidelines from "./VolunteerGuidelines";


export default function EventDetailsContent({
  event,
}: {
  event: CommunityEvent;
}) {
  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden bg-(--color-surface)">

     
      <div className="h-1/2 min-h-0 shrink-0">
        <EventDetailsHero event={event} />
      </div>

      
      <div className="h-1/2 min-h-0 overflow-y-auto p-4 sm:p-5">

        
        <EventMissionSection event={event} />

        
        <div className="mt-4 border-t border-(--color-border) pt-4">
          <VolunteerGuidelines />
        </div>
      </div>
    </article>
  );
}
