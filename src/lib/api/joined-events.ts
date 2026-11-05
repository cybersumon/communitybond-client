

import type { CommunityEvent } from "@/types/event";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001";

export interface JoinedRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: "joined";
  joinedAt: string;
}

export interface JoinedEventItem {
  registration: JoinedRegistration;
  event: CommunityEvent;
}

/**
 * Fetch events joined by the current user.
 */
export async function getMyJoinedEventsApi(
  token: string,
  signal?: AbortSignal
): Promise<JoinedEventItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/joined`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ?? "Unable to load joined events."
    );
  }

  return result.data as JoinedEventItem[];
}

export async function leaveEventApi(
  eventId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${eventId}/join`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ?? "Unable to leave event."
    );
  }
}
