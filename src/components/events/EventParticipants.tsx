
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CircleAlert,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  getEventParticipantsApi,
  type EventParticipant,
} from "@/lib/api/event-participants";


interface EventParticipantsProps {
  eventId: string;
}

function formatJoinedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}


function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U"
  );
}


function ParticipantAvatar({
  participant,
}: {
  participant: EventParticipant;
}) {
  const [imageError, setImageError] =
    useState(false);

  if (participant.image && !imageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={participant.image}
        alt={`${participant.name}'s profile`}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
    >
      {getInitials(participant.name)}
    </div>
  );
}


export default function EventParticipants({
  eventId,
}: EventParticipantsProps) {
  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  const [participants, setParticipants] =
    useState<EventParticipant[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const userId = session?.user?.id;

  
  useEffect(() => {
    if (sessionPending) return;

    if (!userId) {
      return;
    }

    const controller = new AbortController();

    async function loadParticipants() {
      try {
        // Get the current Better Auth JWT.
        const tokenResponse =
          await authClient.token();

        if (controller.signal.aborted) {
          return;
        }

        const token = tokenResponse.data?.token;

        if (!token) {
          throw new Error(
            "Unable to verify your session. Please log in again."
          );
        }

        // Fetch participants from Express.
        const data = await getEventParticipantsApi(
          eventId,
          token,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setParticipants(data);
          setLastUpdated(new Date());
          setError("");
        }
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load participants."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    void loadParticipants();

    return () => controller.abort();
  }, [eventId, userId, sessionPending, retryKey]);

  /**
   * Search participants without contacting
   * the API again.
   */
  const filteredParticipants = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return participants.filter((participant) =>
      participant.name.toLowerCase().includes(keyword)
    );
  }, [participants, search]);

 
  const retry = useCallback(() => {
    setRefreshing(true);
    setRetryKey((previous) => previous + 1);
  }, []);

  
  useEffect(() => {
    function handleRegistrationChanged(event: Event) {
      const detail = (event as CustomEvent<{
        eventId?: string;
      }>).detail;

      if (detail?.eventId === eventId) {
        retry();
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        retry();
      }
    }

    window.addEventListener(
      "communitybond:registration-changed",
      handleRegistrationChanged
    );
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "communitybond:registration-changed",
        handleRegistrationChanged
      );
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [eventId, retry]);

  /**
   * Session loading state.
   */
  if (sessionPending) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <LoaderCircle
          size={20}
          className="animate-spin text-emerald-600"
        />
        Checking your session...
      </div>
    );
  }

  /**
   * Guest state.
   */
  if (!userId) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <UserRound
          size={34}
          className="mx-auto text-emerald-600"
        />

        <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Login required
        </h2>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Please log in to manage your event volunteers.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  /**
   * Loading state.
   */
  if (loading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <LoaderCircle
          size={28}
          className="animate-spin text-emerald-600"
        />

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading registered volunteers...
        </p>
      </div>
    );
  }

  /**
   * Error state.
   */
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-3xl border border-red-200 bg-white px-6 py-14 text-center dark:border-red-900 dark:bg-slate-900"
      >
        <CircleAlert
          size={34}
          className="mx-auto text-red-500"
        />

        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Unable to load volunteers
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {error}
        </p>

        <button
          type="button"
          onClick={retry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Dashboard statistics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Registered Volunteers
            </p>
            <Users
              size={21}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <p className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {participants.length}
          </p>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Total volunteers registered for this event
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Registration Access
            </p>
            <ShieldCheck
              size={21}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <p className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            Organizer Only
          </p>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Protected by JWT and organizer verification
          </p>
        </div>
      </div>

      {/* Participants list */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        {/* List heading and search */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Volunteer List
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {filteredParticipants.length} volunteers found
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Clock3 size={13} aria-hidden="true" />
              {lastUpdated
                ? `Last updated ${lastUpdated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
                : "Not updated yet"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={retry}
              disabled={refreshing}
              aria-label="Refresh volunteers"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <div className="relative w-full sm:w-64">
              <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search volunteers..."
              aria-label="Search volunteers"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
          </div>
        </div>

        {/* Volunteer rows */}
        {filteredParticipants.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredParticipants.map(
              (participant, index) => (
                <div
                  key={participant.registrationId}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:hover:bg-slate-800/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <ParticipantAvatar
                      participant={participant}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {participant.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Volunteer #{index + 1}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                    <CalendarDays
                      size={15}
                      className="text-emerald-600 dark:text-emerald-400"
                    />

                    Joined{" "}
                    {formatJoinedDate(
                      participant.joinedAt
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <Users
              size={35}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              {participants.length === 0
                ? "No volunteers yet"
                : "No matching volunteers"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              {participants.length === 0
                ? "Volunteers who join your event will appear here."
                : "Try searching with a different name."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>

      {/* Navigation */}
      <Link
        href="/my-events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
      >
        <ArrowLeft size={16} />
        Back to My Events
      </Link>
    </div>
  );
}
