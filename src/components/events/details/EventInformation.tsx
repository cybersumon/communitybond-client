import { CommunityEvent } from "@/types/event";
/**
 * EventInformation
 *
 * PURPOSE:
 * Display event date, time, location and category.
 */
type EventInformationProps = {
  event: CommunityEvent;
};
export default function EventInformation({
  event,
}: EventInformationProps) {
  // Your existing component logic...

  return (
    <div>
      {/* Your existing event information JSX. */}
    </div>
  );
}