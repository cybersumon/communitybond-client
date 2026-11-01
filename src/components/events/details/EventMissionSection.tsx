
import { ArrowUpRight, HandHeart, Users } from "lucide-react";
import type { CommunityEvent } from "@/types/event";

/**
 * EventMissionSection
 *
 * PURPOSE:
 * Display the event description and compact
 * Join / Donate actions in a premium minimal layout.
 *
 * WHY:
 * Keep event details visually clean and avoid
 * oversized participation cards.
 *
 * INPUT:
 * Receives the selected event through props.
 *
 * FUTURE:
 * Join will connect to Better Auth + MongoDB.
 * Donate will connect to a donation workflow.
 */
type EventMissionSectionProps = {
  event: CommunityEvent;
};

export default function EventMissionSection({
  event,
}: EventMissionSectionProps) {
  return (
    <section aria-labelledby="event-mission-title">

      {/* Main mission content with compact actions. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Left: Heading and event description. */}
        <div className="min-w-0 flex-1">

          {/* Small premium section label. */}
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--color-primary)">
            The Community Mission
          </p>

          {/* Main section heading. */}
          <h2
            id="event-mission-title"
            className="mt-1.5 text-lg font-extrabold tracking-tight text-(--color-foreground) sm:text-xl"
          >
            Make Every Action Count.
          </h2>

          {/* Dynamic event description from the database/demo data. */}
          <p className="mt-2 whitespace-pre-line text-sm leading-5 text-(--color-muted)">
            {event.description}
          </p>
        </div>

        {/* Right: Small, professional action buttons. */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Join Event: disabled until backend is ready. */}
          <button
            type="button"
            disabled
            title="Joining will be available after authentication setup"
            className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#176B50] px-4 text-xs font-semibold text-white opacity-65 sm:text-sm"
          >
            <ArrowUpRight size={16} aria-hidden="true" />
            Join Event
          </button>

          {/* Donate: optional enhancement, no payment functionality yet. */}
          <button
            type="button"
            disabled
            title="Donation functionality is not available yet"
            aria-label="Donate to this initiative"
            className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-primary) opacity-65"
          >
            <HandHeart size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Compact supportive footer. */}
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
