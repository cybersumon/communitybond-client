
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  CalendarCheck2,
  CalendarClock,
  LayoutGrid,
  ArrowUpRight,
  Plus,
  RotateCcw,
  Pencil,
  LoaderCircle,
  Users,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import DeleteEventButton from "./DeleteEventButton";


type EventStatusFilter =
  | "all"
  | "upcoming"
  | "past";

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
  createdAt: string;
  organizer: {
    id: string;
    name: string;
    photoURL?: string;
  };
}

interface EventsApiResponse {
  success: boolean;
  message?: string;
  data?: CommunityEvent[];
  events?: CommunityEvent[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001";

/**
 * Format ISO datetime for display.
 */
function formatEventDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}


// Format event time in the browser's timezone.

function formatEventTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}


// Determine whether an event is upcoming.

function isUpcomingEvent(
  event: CommunityEvent,
  now: number
): boolean {
  return new Date(event.eventDate).getTime() >= now;
}


// Statistics card.

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof LayoutGrid;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function MyEventCard({
  event,
  now,
  onDeleted,
}: {
  event: CommunityEvent;
  now: number;
  onDeleted: (eventId: string) => void;
}) {
  const upcoming = isUpcomingEvent(event, now);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Event thumbnail */}
      <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-52 dark:bg-slate-800">
        <Image
          src={event.thumbnailUrl}
          alt={event.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status badge */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur ${
              upcoming
                ? "bg-emerald-500 text-white"
                : "bg-slate-900/85 text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {upcoming ? "Upcoming" : "Past Event"}
          </span>
        </div>

        {/* Event category */}
        <div className="absolute bottom-4 left-4">
          <span className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm dark:bg-slate-950/90 dark:text-white">
            {event.eventType}
          </span>
        </div>
      </div>

      {/* Event information */}
      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/events/${event.id}?returnTo=/my-events`}
          className="block"
        >
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            {event.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {event.description}
        </p>

        {/* Event metadata */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <CalendarDays
              size={16}
              className="shrink-0 text-blue-600 dark:text-blue-400"
            />
            <span>{formatEventDate(event.eventDate)}</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <Clock3
              size={16}
              className="shrink-0 text-blue-600 dark:text-blue-400"
            />
            <span>{formatEventTime(event.eventDate)}</span>
          </div>

          <div className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <MapPin
              size={16}
              className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
            />
            <span className="line-clamp-2">
              {event.location}
            </span>
          </div>
        </div>

        {/* Push actions to card bottom */}
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Link
              href={`/events/${event.id}?returnTo=/my-events`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Details
              <ArrowUpRight size={15} />
            </Link>

            <Link
              href={`/events/${event.id}/edit`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200 dark:hover:text-blue-400"
            >
              <Pencil size={15} />
              Edit
            </Link>

            {/* Organizer-only volunteer management */}
            <Link
              href={`/my-events/${event.id}/participants`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
            >
              <Users size={15} />
              Volunteers
            </Link>

            <DeleteEventButton
              eventId={event.id}
              eventTitle={event.title}
              onDeleted={onDeleted}
            />
          </div>
        </div>
      </div>
    </article>
  );
}


// Main My Events dashboard.

export default function MyEventsDashboard() {
  // Better Auth session.
  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  // Events data.
  const [events, setEvents] = useState<CommunityEvent[]>([]);

  // UI states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<EventStatusFilter>("all");

  const userId = session?.user?.id;

  useEffect(() => {
    // The guest UI is handled during rendering, not in the effect.
    // Avoid synchronous state updates inside effects.
    if (sessionPending || !userId) return;

    const controller = new AbortController();

    async function loadMyEvents() {
      setLoading(true);
      setError("");

      try {
        // Retrieve Better Auth JWT.
        const tokenResponse = await authClient.token();

        if (controller.signal.aborted) return;

        const token = tokenResponse.data?.token;

        if (!token) {
          throw new Error(
            "Unable to verify your session. Please log in again."
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/api/events/my`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result =
          (await response.json()) as EventsApiResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ?? "Unable to load your events."
          );
        }

        // Supports { data: [...] } or { events: [...] }.
        const fetchedEvents =
          result.data ?? result.events;

        if (!Array.isArray(fetchedEvents)) {
          throw new Error("Invalid events API response.");
        }

        if (!controller.signal.aborted) {
          setEvents(fetchedEvents);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading events."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadMyEvents();

    return () => controller.abort();
  }, [userId, sessionPending, retryCount]);

  function handleEventDeleted(deletedEventId: string) {
    setEvents((previousEvents) =>
      previousEvents.filter(
        (event) => event.id !== deletedEventId
      )
    );
  }

  const [now] = useState(() => Date.now());

 
  // Dashboard statistics.
 
  const totalEvents = events.length;

  const upcomingCount = events.filter((event) =>
    isUpcomingEvent(event, now)
  ).length;

  const pastCount = totalEvents - upcomingCount;

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.eventType.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      const upcoming = isUpcomingEvent(event, now);

      const matchesFilter =
        filter === "all" ||
        (filter === "upcoming" && upcoming) ||
        (filter === "past" && !upcoming);

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter, now]);

  /**
   * Login required state.
   */
  if (!sessionPending && !session?.user) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <CalendarDays
          size={35}
          className="mx-auto text-blue-600"
        />

        <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
          Sign in to manage events
        </h2>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Please log in to view and manage the events
          you have created.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  /**
   * Loading state.
   */
  if (sessionPending || loading) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-3">
        <LoaderCircle
          size={30}
          className="animate-spin text-blue-600"
        />

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading your events...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
            Organizer Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            My Events
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Manage, update, and track your community events.
          </p>
        </div>

        <Link
          href="/create-event"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setRetryCount((value) => value + 1)}
            className="inline-flex shrink-0 items-center gap-1 font-semibold underline"
          >
            <RotateCcw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Events"
          value={totalEvents}
          description="Events you have created"
          icon={LayoutGrid}
        />

        <StatCard
          title="Upcoming Events"
          value={upcomingCount}
          description="Events scheduled for the future"
          icon={CalendarClock}
        />

        <StatCard
          title="Past Events"
          value={pastCount}
          description="Events whose dates have passed"
          icon={CalendarCheck2}
        />
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search your events..."
            aria-label="Search your events"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "All Events" },
              { value: "upcoming", label: "Upcoming" },
              { value: "past", label: "Past" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={filter === option.value}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                filter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event results */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Your Events
          </h2>

          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1
              ? "event"
              : "events"}
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <MyEventCard
                key={event.id}
                event={event}
                now={now}
                onDeleted={handleEventDeleted}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <CalendarDays
              size={34}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              {totalEvents === 0
                ? "You haven't created any events yet"
                : "No matching events found"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              {totalEvents === 0
                ? "Create your first event and start making a positive impact in your community."
                : "Try adjusting your search or selecting a different filter."}
            </p>

            {totalEvents === 0 ? (
              <Link
                href="/create-event"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={17} />
                Create First Event
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RotateCcw size={16} />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
