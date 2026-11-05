
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  LoaderCircle,
  LogIn,
  UserRoundPlus,
  LockKeyhole,
  RefreshCw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  joinEventApi,
  getMyRegistrationApi,
} from "@/lib/api/join-event";


interface JoinEventButtonProps {
  eventId: string;
  organizerId: string;
  eventDate: string;
}

type RegistrationState =
  | "loading"
  | "not-joined"
  | "joined"
  | "error";

interface RegistrationChangedDetail {
  eventId: string;
  joined: boolean;
}

const REGISTRATION_CHANGED =
  "communitybond:registration-changed";

export default function JoinEventButton({
  eventId,
  organizerId,
  eventDate,
}: JoinEventButtonProps) {
  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  const [registrationState, setRegistrationState] =
    useState<RegistrationState>("loading");

  const [checkedKey, setCheckedKey] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Capture a stable time for determining
  // whether event registration is closed.
  const [currentTime] = useState(() => Date.now());

  const currentUserId = session?.user?.id;

  const isOrganizer =
    Boolean(currentUserId) &&
    currentUserId === organizerId;

  const eventTimestamp = new Date(
    eventDate
  ).getTime();

  const isPastEvent =
    Number.isFinite(eventTimestamp) &&
    eventTimestamp <= currentTime;

  
  const registrationKey =
    `${currentUserId ?? "guest"}:${eventId}`;

  const visibleRegistrationState =
    checkedKey === registrationKey
      ? registrationState
      : "loading";


  useEffect(() => {
    if (
      sessionPending ||
      !currentUserId ||
      isOrganizer ||
      isPastEvent
    ) {
      return;
    }

    const controller = new AbortController();

    async function checkRegistration() {
      try {
        const tokenResponse =
          await authClient.token();

        if (controller.signal.aborted) return;

        const token = tokenResponse.data?.token;

        if (!token) {
          throw new Error(
            "Unable to verify your session."
          );
        }

        const result = await getMyRegistrationApi(
          eventId,
          token,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setRegistrationState(
          result.joined ? "joined" : "not-joined"
        );

        setCheckedKey(registrationKey);
        setError("");
      } catch (err) {
        if (controller.signal.aborted) return;

        setRegistrationState("error");
        setCheckedKey(registrationKey);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to check registration."
        );
      }
    }

    void checkRegistration();

    return () => controller.abort();
  }, [
    eventId,
    currentUserId,
    sessionPending,
    isOrganizer,
    isPastEvent,
    retryCount,
    registrationKey,
  ]);


  useEffect(() => {
    function handleRegistrationChanged(
      event: Event
    ) {
      const customEvent =
        event as CustomEvent<RegistrationChangedDetail>;

      const detail = customEvent.detail;

      if (!detail || detail.eventId !== eventId) {
        return;
      }

      setRegistrationState(
        detail.joined ? "joined" : "not-joined"
      );

      setCheckedKey(registrationKey);
      setError("");
    }

    window.addEventListener(
      REGISTRATION_CHANGED,
      handleRegistrationChanged
    );

    return () => {
      window.removeEventListener(
        REGISTRATION_CHANGED,
        handleRegistrationChanged
      );
    };
  }, [eventId, registrationKey]);

  
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setRetryCount((value) => value + 1);
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  
  async function handleJoin() {
    if (
      joining ||
      !currentUserId ||
      isOrganizer ||
      isPastEvent ||
      visibleRegistrationState !== "not-joined"
    ) {
      return;
    }

    setJoining(true);
    setError("");

    try {
      const tokenResponse =
        await authClient.token();

      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      await joinEventApi(eventId, token);

      setRegistrationState("joined");
      setCheckedKey(registrationKey);

     
      window.dispatchEvent(
        new CustomEvent<RegistrationChangedDetail>(
          REGISTRATION_CHANGED,
          {
            detail: {
              eventId,
              joined: true,
            },
          }
        )
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to join this event.";

      if (
        message
          .toLowerCase()
          .includes("already joined")
      ) {
        setRegistrationState("joined");
        setCheckedKey(registrationKey);

        window.dispatchEvent(
          new CustomEvent<RegistrationChangedDetail>(
            REGISTRATION_CHANGED,
            {
              detail: {
                eventId,
                joined: true,
              },
            }
          )
        );
      } else {
        setError(message);
      }
    } finally {
      setJoining(false);
    }
  }

  
  const buttonBase =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed";

  if (sessionPending) {
    return (
      <button
        type="button"
        disabled
        className={`${buttonBase} bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400`}
      >
        <LoaderCircle
          size={16}
          className="animate-spin"
        />
        Checking...
      </button>
    );
  }

  if (isPastEvent) {
    return (
      <button
        type="button"
        disabled
        className={`${buttonBase} bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400`}
      >
        <LockKeyhole size={16} />
        Registration Closed
      </button>
    );
  }

  if (!currentUserId) {
    return (
      <Link
        href="/login"
        className={`${buttonBase} bg-blue-600 text-white hover:bg-blue-700`}
      >
        <LogIn size={16} />
        Login to Join
      </Link>
    );
  }

  if (isOrganizer) {
    return (
      <button
        type="button"
        disabled
        className={`${buttonBase} bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300`}
      >
        <CheckCircle2 size={16} />
        Your Event
      </button>
    );
  }

  if (visibleRegistrationState === "loading") {
    return (
      <button
        type="button"
        disabled
        className={`${buttonBase} bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400`}
      >
        <LoaderCircle
          size={16}
          className="animate-spin"
        />
        Checking Status...
      </button>
    );
  }

  if (visibleRegistrationState === "joined") {
    return (
      <div
        role="status"
        className={`${buttonBase} bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400`}
      >
        <CheckCircle2 size={17} />
        Joined
      </div>
    );
  }

  if (visibleRegistrationState === "error") {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() =>
            setRetryCount((value) => value + 1)
          }
          className={`${buttonBase} border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800`}
        >
          <RefreshCw size={16} />
          Retry Status Check
        </button>

        {error && (
          <p
            role="alert"
            className="text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleJoin}
        disabled={joining}
        className={`${buttonBase} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60`}
      >
        {joining ? (
          <>
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
            Joining...
          </>
        ) : (
          <>
            <UserRoundPlus size={17} />
            Join Event
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
