
/**
 * Update Event API
 *
 * PURPOSE:
 * Send authenticated event updates to
 * the CommunityBond Express backend.
 */

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  eventType?: string;
  thumbnailUrl?: string;
  location?: string;
  eventDate?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001";

export async function updateEventApi(
  eventId: string,
  payload: UpdateEventPayload,
  token: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Unable to update event."
    );
  }

  return result;
}
