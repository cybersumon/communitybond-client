
import type { EventOrganizer as OrganizerType } from "@/types/event";


type EventOrganizerProps = {
  organizer: OrganizerType;
};

export default function EventOrganizer({
  organizer,
}: EventOrganizerProps) {
  // Prepare an initial for the avatar fallback.
  const initial = organizer.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="flex min-w-0 items-center gap-3">
      {/* Simple initial avatar for our current demo. */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--color-surface) bg-[#176B50] font-bold text-white">
        {initial}
      </div>

      {/* Organizer's public display name. */}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-(--color-muted)">
          Organized by
        </p>

        <p className="truncate text-sm font-semibold text-(--color-foreground)">
          {organizer.name}
        </p>
      </div>
    </div>
  );
}
