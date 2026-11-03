
import Link from "next/link";
import { CalendarSearch, PlusCircle } from "lucide-react";

import type { CommunityEvent } from "@/types/event";
import EventCard from "./EventCard";

/**
 * EventGrid
 *
 * PURPOSE:
 * Display a responsive collection of EventCards.
 *
 * FEATURES:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3 columns
 * - Empty state
 * - Return navigation support
 *
 * NAVIGATION:
 * Pass returnTo to every EventCard so the
 * event details modal knows where to return.
 */

export type EventReturnPath =
  | "/"
  | "/upcoming-events"
  | "/my-events";

type EventGridProps = {
  events: CommunityEvent[];
  returnTo?: EventReturnPath;
  emptyTitle?: string;
  emptyDescription?: string;
  showCreateButton?: boolean;
};

export default function EventGrid({
  events,
  returnTo = "/upcoming-events",
  emptyTitle = "No events found",
  emptyDescription = "There are no events matching your selection.",
  showCreateButton = false,
}: EventGridProps) {
  /**
   * Empty state when there are no events.
   */
  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-primary)/10 text-(--color-primary)">
          <CalendarSearch
            size={30}
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-5 text-xl font-bold text-(--color-foreground)">
          {emptyTitle}
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-(--color-muted)">
          {emptyDescription}
        </p>

        {showCreateButton && (
          <Link
            href="/create-event"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            <PlusCircle
              size={17}
              aria-hidden="true"
            />
            Create an Event
          </Link>
        )}
      </div>
    );
  }

  /**
   * Render event cards.
   */
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          returnTo={returnTo}
        />
      ))}
    </div>
  );
}
