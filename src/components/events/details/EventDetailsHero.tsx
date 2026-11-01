
import Image from "next/image";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import type { CommunityEvent } from "@/types/event";

/**
 * EventDetailsHero
 *
 * PURPOSE:
 * Show event information directly over the image.
 *
 * HOW:
 * - Image fills the entire hero container.
 * - Gradient overlays the image for readability.
 * - Event information is absolutely positioned
 *   over the image, not below it.
 */
export default function EventDetailsHero({
  event,
}: {
  event: CommunityEvent;
}) {
  const eventDate = new Date(event.eventDate);

  // Format the event date for Bangladesh.
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(eventDate);

  // Format event time using Asia/Dhaka timezone.
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(eventDate);

  return (
    <section className="relative h-full w-full overflow-hidden bg-[#142B25]">

      {/* Full background image, covering all hero space. */}
      <Image
        src={event.thumbnailUrl}
        alt={event.title}
        fill
        sizes="(max-width: 768px) 100vw, 820px"
        className="object-cover"
      />

      {/* Gradient appears ON TOP of the image, not below it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/10"
      />

      {/* Event category stays at the top-left of the photo. */}
      <span className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#176B50]">
        {event.eventType}
      </span>

      {/* Information positioned over the bottom of the image. */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white sm:p-6">

        {/* Event title. */}
        <h1 className="line-clamp-2 text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">
          {event.title}
        </h1>

        {/* Date, time and location. */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/90">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} aria-hidden="true" />
            {date}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} aria-hidden="true" />
            {time}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} aria-hidden="true" />
            {event.location}
          </span>
        </div>

        {/* Organizer name remains inside the image overlay. */}
        <p className="mt-2 text-xs text-white/85">
          Organized by{" "}
          <strong className="text-white">
            {event.organizer.name}
          </strong>
        </p>
      </div>
    </section>
  );
}
