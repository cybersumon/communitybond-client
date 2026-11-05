
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  CalendarCheck2,
  CalendarClock,
  LoaderCircle,
  MapPin,
  Search,
  Users,
  RotateCcw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  getMyJoinedEventsApi,
  type JoinedEventItem,
} from "@/lib/api/joined-events";

import LeaveEventButton from "./LeaveEventButton";


type Filter = "all" | "upcoming" | "past";

/**
 * Dashboard filtering tabs.
 */
const tabs: { value: Filter; label: string }[] = [
  {
    value: "all",
    label: "All Events",
  },
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "past",
    label: "Past",
  },
];

/**
 * Format event and registration dates.
 */
function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}


function isUpcoming(
  item: JoinedEventItem,
  now: number
): boolean {
  return (
    new Date(item.event.eventDate).getTime() >= now
  );
}

export default function JoinedEventsDashboard() {
  
  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

 
  const userId = session?.user?.id;

  
  const [items, setItems] = useState<JoinedEventItem[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<Filter>("all");

  const [retryCount, setRetryCount] = useState(0);


  const [now] = useState(() => Date.now());

  
  useEffect(() => {
    // Wait until Better Auth finishes loading.
    if (sessionPending) {
      return;
    }

    // Guests do not fetch private events.
    if (!userId) {
      return;
    }

    const controller = new AbortController();

    async function loadEvents() {
      setLoading(true);
      setError("");

      try {
    
        const tokenResponse = await authClient.token();

        if (controller.signal.aborted) {
          return;
        }

        const token = tokenResponse.data?.token;

        if (!token) {
          throw new Error(
            "Please log in again to continue."
          );
        }

        const data = await getMyJoinedEventsApi(
          token,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setItems(data);
        }
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load joined events."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadEvents();

   
    return () => {
      controller.abort();
    };
  }, [userId, sessionPending, retryCount]);

  function handleEventLeft(eventId: string) {
    setItems((previous) =>
      previous.filter(
        (item) => item.event.id !== eventId
      )
    );
  }

  const upcomingCount = items.filter((item) =>
    isUpcoming(item, now)
  ).length;

  const pastCount = items.length - upcomingCount;

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const event = item.event;

      const matchesSearch =
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.eventType.toLowerCase().includes(query);

      const upcoming = isUpcoming(item, now);

      const matchesFilter =
        filter === "all" ||
        (filter === "upcoming" && upcoming) ||
        (filter === "past" && !upcoming);

      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter, now]);

  /**
   * Authentication loading screen.
   */
  if (sessionPending) {
    return (
      <div className="py-20 text-center text-sm text-(--color-muted)">
        Checking your session...
      </div>
    );
  }

  /**
   * Guest state.
   */
  if (!userId) {
    return (
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-16 text-center">
        <Users
          size={36}
          className="mx-auto text-(--color-primary)"
          aria-hidden="true"
        />

        <h2 className="mt-5 text-xl font-bold text-(--color-foreground)">
          Sign in to view joined events
        </h2>

        <p className="mt-2 text-sm text-(--color-muted)">
          Track the community events you have joined.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Login
        </Link>
      </div>
    );
  }

  /**
   * Data loading screen.
   */
  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-(--color-muted)">
        <LoaderCircle
          size={24}
          className="animate-spin text-(--color-primary)"
          aria-hidden="true"
        />

        Loading your joined events...
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Dashboard heading */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-(--color-primary)">
          Volunteer Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-(--color-foreground) sm:text-4xl">
          My Joined Events
        </h1>

        <p className="mt-3 text-sm text-(--color-muted)">
          Track your volunteering activities and manage
          your event registrations.
        </p>
      </div>

      {/* API error and retry */}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setRetryCount((count) => count + 1)
            }
            className="inline-flex cursor-pointer items-center gap-2 font-semibold underline"
          >
            <RotateCcw
              size={15}
              aria-hidden="true"
            />
            Retry
          </button>
        </div>
      )}

      {/* Registration statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Joined",
            count: items.length,
            icon: Users,
          },
          {
            label: "Upcoming",
            count: upcomingCount,
            icon: CalendarClock,
          },
          {
            label: "Past Events",
            count: pastCount,
            icon: CalendarCheck2,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-(--color-muted)">
                {stat.label}
              </p>

              <stat.icon
                size={20}
                className="text-(--color-primary)"
                aria-hidden="true"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-(--color-foreground)">
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Search and filtering */}
      <div className="flex flex-col gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={17}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-(--color-muted)"
            aria-hidden="true"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search joined events..."
            aria-label="Search joined events"
            className="w-full rounded-xl border border-(--color-border) bg-(--color-background) py-3 pr-4 pl-10 text-sm text-(--color-foreground) outline-none transition focus:border-(--color-primary)"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={filter === tab.value}
              onClick={() => setFilter(tab.value)}
              className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                filter === tab.value
                  ? "bg-(--color-primary) text-white"
                  : "bg-(--color-background) text-(--color-muted) hover:text-(--color-primary)"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Joined event cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.registration.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm transition-shadow hover:shadow-lg"
            >
              {/* Event image */}
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                {item.event.thumbnailUrl ? (
                  <Image
                    src={item.event.thumbnailUrl}
                    alt={item.event.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-teal-700 to-slate-900" />
                )}

                {/* Joined badge */}
                <span className="absolute top-4 left-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white">
                  Joined
                </span>
              </div>

              {/* Card content */}
              <div className="flex flex-1 flex-col p-5">
                {/* Event category */}
                <p className="text-xs font-semibold uppercase tracking-wide text-(--color-primary)">
                  {item.event.eventType}
                </p>

                {/* Event title */}
                <h2 className="mt-2 line-clamp-2 text-lg font-bold text-(--color-foreground)">
                  {item.event.title}
                </h2>

                {/* Event description */}
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-(--color-muted)">
                  {item.event.description}
                </p>

                {/* Event information */}
                <div className="mt-4 space-y-2.5 text-sm text-(--color-foreground)">
                  {/* Event date */}
                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={16}
                      className="shrink-0 text-(--color-primary)"
                      aria-hidden="true"
                    />

                    {formatDate(item.event.eventDate)}
                  </div>

                  {/* Event location */}
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      className="shrink-0 text-(--color-primary)"
                      aria-hidden="true"
                    />

                    <span className="line-clamp-1">
                      {item.event.location}
                    </span>
                  </div>

                  {/* Registration date */}
                  <div className="text-xs text-(--color-muted)">
                    Joined on{" "}
                    {formatDate(
                      item.registration.joinedAt
                    )}
                  </div>
                </div>

                {/* Event actions */}
                <div className="mt-auto flex flex-wrap gap-2 border-t border-(--color-border) pt-5">
                  {/* View details */}
                  <Link
                    href={`/events/${item.event.id}?returnTo=/my-joined-events`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-(--color-primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    View Event

                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                    />
                  </Link>

                  {/* Leave event */}
                  <LeaveEventButton
                    eventId={item.event.id}
                    eventTitle={item.event.title}
                    onLeft={handleEventLeft}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-3xl border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-16 text-center">
          <CalendarCheck2
            size={36}
            className="mx-auto text-(--color-muted)"
            aria-hidden="true"
          />

          <h2 className="mt-5 text-xl font-bold text-(--color-foreground)">
            {items.length === 0
              ? "You haven't joined any events yet"
              : "No matching events found"}
          </h2>

          <p className="mt-2 text-sm text-(--color-muted)">
            {items.length === 0
              ? "Explore upcoming community events and start volunteering."
              : "Try changing your search or filters."}
          </p>

          {items.length === 0 ? (
            <Link
              href="/upcoming-events"
              className="mt-6 inline-flex rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Explore Events
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-6 cursor-pointer rounded-xl border border-(--color-border) px-5 py-3 text-sm font-semibold text-(--color-foreground) transition hover:border-(--color-primary)"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
