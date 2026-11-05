import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  HeartHandshake,
  MapPin,
  Sparkles,
} from "lucide-react";

import { getRecentEvents } from "@/lib/api/events";
export default async function CommunityGallerySection() {
  const events = await getRecentEvents();

  return (
    <section
      id="community-in-action"
      aria-labelledby="community-gallery-heading"
      className="relative overflow-hidden bg-(--color-background) pt-10 pb-2 sm:pt-12 sm:pb-3 lg:pt-10 lg:pb-2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-7xl bg-(--color-border)"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-4 py-2">
            <Camera
              size={15}
              className="text-(--color-primary)"
              aria-hidden="true"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-(--color-primary)">
              Visual Stories
            </span>
          </div>

          <h2
            id="community-gallery-heading"
            className="text-3xl font-extrabold tracking-tight text-(--color-foreground) sm:text-4xl"
          >
            Community in Action
          </h2>

          <p className="mt-4 text-sm leading-7 text-(--color-muted) sm:text-base">
            Discover the people, places, and community initiatives bringing
            positive change to our neighborhoods.
          </p>
        </div>

        {events.length > 0 ? (
          <>
            {/* Responsive image-led event gallery */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {events.slice(0, 6).map((event, index) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}?returnTo=%2F`}
                  aria-label={`View event: ${event.title}`}
                  className="group relative isolate block h-64 overflow-hidden rounded-2xl border border-(--color-border) bg-slate-800 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary) sm:h-72"
                >
                  {event.thumbnailUrl ? (
                    <Image
                      src={event.thumbnailUrl}
                      alt={event.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-700 via-teal-700 to-slate-900" />
                  )}

                  {/* Keep overlay text legible on photographs. */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-black/10 transition-colors group-hover:from-black/95" />

                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                    <span className="mb-3 w-fit max-w-full truncate rounded-full bg-emerald-500/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {event.eventType}
                    </span>

                    <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-white sm:text-xl">
                      {event.title}
                    </h3>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-1.5 text-xs text-white/85">
                        <MapPin size={14} className="shrink-0" aria-hidden="true" />
                        <span className="truncate">{event.location}</span>
                      </span>
                      <ArrowRight
                        size={18}
                        className="shrink-0 text-white transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA to explore events beyond the six preview cards. */}
            <div className="mt-9 text-center">
              <Link
                href="/upcoming-events"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-5 py-3 text-sm font-bold text-(--color-foreground) transition hover:border-(--color-primary) hover:text-(--color-primary)"
              >
                <HeartHandshake size={17} aria-hidden="true" />
                Explore More Community Events
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          /* Honest empty state when MongoDB has no upcoming events. */
          <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-14 text-center">
            <Sparkles
              size={34}
              className="mx-auto text-(--color-primary)"
              aria-hidden="true"
            />
            <h3 className="mt-5 text-xl font-bold text-(--color-foreground)">
              Every story starts with an action
            </h3>
            <p className="mt-3 text-sm leading-6 text-(--color-muted)">
              New community stories will appear here as events are created.
            </p>
            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Create an Event
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
