
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

import {
  CalendarDays,
  CalendarPlus,
  Clock3,
  Eye,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  ArrowUpRight,
  Inbox,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getMyEvents } from "@/lib/api/my-events";
import type { CommunityEvent } from "@/types/event";

/**
 * MyEventsDashboard
 *
 * PURPOSE:
 * Display events created by the current user.
 *
 * FEATURES:
 * - Authenticated API request
 * - Statistics
 * - Search
 * - Status filtering
 * - Event details navigation
 * - Loading, error and empty states
 *
 * SECURITY:
 * The backend filters events using the verified JWT.
 */

type FilterStatus = "all" | "upcoming" | "past";

const filters: {
  label: string;
  value: FilterStatus;
}[] = [
  { label: "All Events", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past Events", value: "past" },
];

export default function MyEventsDashboard() {
  const { data: session, isPending } =
    authClient.useSession();

  const userId = session?.user?.id;

  const [events, setEvents] =
    useState<CommunityEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<FilterStatus>("all");

  // Refresh statistics periodically on interaction,
  // not through a background polling timer.
  const [now, setNow] = useState(() => Date.now());

  /**
   * Load events using the Better Auth JWT.
   */
  const loadEvents = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setErrorMessage("");

      try {
        const { data, error } =
          await authClient.token();

        if (signal?.aborted) return;

        if (error || !data?.token) {
          throw new Error(
            "Unable to verify your session. Please sign in again."
          );
        }

        const results = await getMyEvents(
          data.token,
          signal
        );

        if (signal?.aborted) return;

        setEvents(results);
        setNow(Date.now());
      } catch (error) {
        if (signal?.aborted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your events."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  /**
   * Fetch when an authenticated user is available.
   */
  useEffect(() => {
    if (isPending || !userId) return;

    const controller = new AbortController();

    void loadEvents(controller.signal);

    return () => controller.abort();
  }, [isPending, userId, loadEvents]);

  /**
   * Calculate dashboard statistics.
   */
  const statistics = useMemo(() => {
    const upcoming = events.filter(
      (event) =>
        new Date(event.eventDate).getTime() >= now
    ).length;

    return {
      total: events.length,
      upcoming,
      past: events.length - upcoming,
    };
  }, [events, now]);

  /**
   * Apply status and search filters.
   */
  const filteredEvents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return events.filter((event) => {
      const eventTime =
        new Date(event.eventDate).getTime();

      const upcoming = eventTime >= now;

      if (status === "upcoming" && !upcoming) {
        return false;
      }

      if (status === "past" && upcoming) {
        return false;
      }

      if (!keyword) return true;

      return [
        event.title,
        event.description,
        event.eventType,
        event.location,
      ].some((value) =>
        value.toLowerCase().includes(keyword)
      );
    });
  }, [events, search, status, now]);

  /**
   * Loading authentication.
   */
  if (isPending) {
    return (
      <div
        role="status"
        className="flex min-h-70 items-center justify-center gap-3 text-(--color-muted)"
      >
        <LoaderCircle
          size={20}
          className="animate-spin"
        />
        Checking your session...
      </div>
    );
  }

  /**
   * Guest users cannot access the dashboard.
   */
  if (!session?.user) {
    return (
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-12 text-center">
        <ShieldCheck
          size={38}
          className="mx-auto text-(--color-primary)"
        />

        <h2 className="mt-4 text-xl font-bold text-(--color-foreground)">
          Sign in to view your events
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm text-(--color-muted)">
          Manage the community events you have created.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white"
        >
          Sign in
        </Link>
      </div>
    );
  }

  /**
   * Dashboard interface.
   */
  return (
    <div className="space-y-7">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-(--color-primary)">
            Organizer Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-(--color-foreground) sm:text-4xl">
            My Events
          </h1>

          <p className="mt-2 text-sm text-(--color-muted)">
            View and manage your community initiatives.
          </p>
        </div>

        <Link
          href="/create-event"
          className="inline-flex items-center gap-2 rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          <CalendarPlus size={18} />
          Create Event
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Total Events",
            value: statistics.total,
            icon: CalendarDays,
          },
          {
            title: "Upcoming Events",
            value: statistics.upcoming,
            icon: Clock3,
          },
          {
            title: "Past Events",
            value: statistics.past,
            icon: ShieldCheck,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-(--color-muted)">
                  {item.title}
                </p>

                <div className="rounded-xl bg-(--color-primary)/10 p-2.5 text-(--color-primary)">
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-extrabold text-(--color-foreground)">
                {loading ? "—" : item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-muted)"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your events..."
              aria-label="Search your events"
              className="w-full rounded-xl border border-(--color-border) bg-(--color-background) py-3 pl-11 pr-4 text-sm text-(--color-foreground) outline-none focus:border-(--color-primary)"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setStatus(filter.value)
                }
                aria-pressed={status === filter.value}
                className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  status === filter.value
                    ? "bg-(--color-primary) text-white"
                    : "border border-(--color-border) text-(--color-muted) hover:text-(--color-primary)"
                }`}
              >
                {filter.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => void loadEvents()}
              disabled={loading}
              aria-label="Refresh my events"
              title="Refresh events"
              className="rounded-xl border border-(--color-border) p-2.5 text-(--color-muted) hover:text-(--color-primary) disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      {/* API error */}
      {errorMessage && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          <AlertCircle size={19} />
          <span className="flex-1">{errorMessage}</span>

          <button
            type="button"
            onClick={() => void loadEvents()}
            className="cursor-pointer font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div
          role="status"
          className="flex min-h-52 items-center justify-center gap-3 text-sm text-(--color-muted)"
        >
          <LoaderCircle
            size={20}
            className="animate-spin"
          />
          Loading your events...
        </div>
      ) : !errorMessage && filteredEvents.length === 0 ? (
        /* Empty state */
        <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-14 text-center">
          <Inbox
            size={40}
            className="mx-auto text-(--color-muted)"
          />

          <h2 className="mt-4 text-xl font-bold text-(--color-foreground)">
            {events.length === 0
              ? "You have not created any events yet"
              : "No matching events found"}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-(--color-muted)">
            {events.length === 0
              ? "Create your first event and make a positive impact."
              : "Try adjusting your search or selected filter."}
          </p>

          {events.length === 0 && (
            <Link
              href="/create-event"
              className="mt-6 inline-flex rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-bold text-white"
            >
              Create Your First Event
            </Link>
          )}
        </div>
      ) : !errorMessage ? (
        /* Events grid */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const eventTime =
              new Date(event.eventDate).getTime();

            const upcoming = eventTime >= now;

            const formattedDate = new Intl.DateTimeFormat(
              "en-GB",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Dhaka",
              }
            ).format(new Date(event.eventDate));

            return (
              <article
                key={event.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-sm transition hover:shadow-lg"
              >
                {/* Event cover */}
                <div className="relative h-44 overflow-hidden bg-(--color-background)">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />

                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                      upcoming
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-white"
                    }`}
                  >
                    {upcoming ? "Upcoming" : "Past"}
                  </span>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-(--color-primary)">
                    {event.eventType}
                  </p>

                  <h3 className="mt-2 line-clamp-2 text-lg font-bold text-(--color-foreground)">
                    {event.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-(--color-muted)">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-(--color-muted)">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formattedDate}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="truncate">
                        {event.location}
                      </span>
                    </p>
                  </div>

                  {/* Action footer */}
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-(--color-border) pt-5 mt-5">
                    <Link
                      href={`/events/${event.id}?returnTo=/my-events`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary) hover:underline"
                    >
                      <Eye size={17} />
                      View Event
                    </Link>

<Link
  href={`/events/${event.id}/edit`}
  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200"
>
  Edit Event
</Link>

                    <Link
                      href={`/events/${event.id}?returnTo=/my-events`}
                      aria-label={`Open ${event.title}`}
                      className="rounded-xl border border-(--color-border) p-2.5 text-(--color-foreground) transition hover:border-(--color-primary)"
                    >
                      <ArrowUpRight size={18} />
                    </Link>

                                        
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
