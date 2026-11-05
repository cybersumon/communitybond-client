

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001";

export interface EventParticipant {
  registrationId: string;
  userId: string;
  name: string;
  image: string | null;
  joinedAt: string;
}

interface ParticipantsApiResponse {
  success: boolean;
  count: number;
  message?: string;
  data: EventParticipant[];
}

/**
 * Retrieve an event's registered volunteers.
 */
export async function getEventParticipantsApi(
  eventId: string,
  token: string,
  signal?: AbortSignal
): Promise<EventParticipant[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${eventId}/participants`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal,
    }
  );

  const result =
    (await response.json()) as ParticipantsApiResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ?? "Unable to load participants."
    );
  }

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid participants response.");
  }

  return result.data;
}
