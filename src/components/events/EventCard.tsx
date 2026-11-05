
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

import type { CommunityEvent } from "@/types/event";

import EventDateBadge from "./EventDateBadge";
import EventOrganizer from "./EventOrganizer";

type EventCardProps = {
  event: CommunityEvent;
  returnTo?: "/" | "/upcoming-events" | "/my-events";
};

export default function EventCard({
  event,
  returnTo = "/upcoming-events",
}: EventCardProps) {
  // Use Dhaka time for consistent event information.
  const eventDate = new Date(event.eventDate);

  // Format the date in a readable form.
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(eventDate);

  // Display the scheduled time in Bangladesh time.
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(eventDate);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Large image with subtle hover zoom. */}
      <div className="relative h-58 overflow-hidden bg-(--color-hero)">
        
<Image
  src={event.thumbnailUrl}
  alt={event.title}
  fill
  unoptimized
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
  className="object-cover transition-transform duration-500 group-hover:scale-105"
/>


        {/* Subtle gradient behind the date badge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent"
        />

        {/* Independent date badge component. */}
        <EventDateBadge date={event.eventDate} />
      </div>

      {/* Card information area. */}
      <div className="flex flex-1 flex-col p-6">

        {/* Event category and date. */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-(--color-hero) px-3 py-1.5 text-xs font-bold text-(--color-primary)">
            {event.eventType}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-(--color-muted)">
            <CalendarDays size={15} aria-hidden="true" />
            {formattedDate}
          </span>
        </div>

        {/* Event title with limited visual height. */}
        <h3 className="line-clamp-2 text-xl font-bold leading-snug text-(--color-foreground)">
          {event.title}
        </h3>

        {/* Short summary with consistent spacing. */}
        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-(--color-muted)">
          {event.description}
        </p>

        {/* Location and event time. */}
        <div className="mt-5 space-y-2.5 text-sm text-(--color-muted)">
          <div className="flex items-start gap-2">
            <MapPin
              size={17}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={17} aria-hidden="true" />
            <span>{formattedTime} (Dhaka)</span>
          </div>
        </div>

        {/* Push organizer and CTA to the card bottom. */}
        <div className="mt-auto pt-5">
          <div className="mb-5 border-t border-(--color-border)" />

          <div className="flex items-center justify-between gap-3">
            {/* Independent organizer component. */}
            <EventOrganizer organizer={event.organizer} />

            {/* Modern compact detail-page action. */}
            <Link
  href={{
    pathname: `/events/${event.id}`,
    query: { returnTo },
  }}
  aria-label={`View details for ${event.title}`}
  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#176B50] text-white transition-all hover:scale-105 hover:bg-[#11513D]"
>
  <ArrowUpRight size={21} aria-hidden="true" />
</Link>



          </div>
        </div>
      </div>
    </article>
  );
}
