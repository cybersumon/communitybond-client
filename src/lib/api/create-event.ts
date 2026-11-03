
/**
 * Create Event API Client
 *
 * PURPOSE:
 * Submit a new event to the Express API.
 *
 * SECURITY:
 * - JWT is sent in the Authorization header.
 * - No JWT is stored in localStorage.
 * - Organizer ID is assigned by the backend.
 */

// Form data sent to Express.js.
export type CreateEventInput = {
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
};

// Fields returned by the Create Event API.
type CreatedEvent = {
  id: string;
  title: string;
};

// Express API response shape.
type CreateEventResponse = {
  success: boolean;
  message?: string;
  data?: CreatedEvent;
  errors?: Record<string, string[] | undefined>;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000";

/**
 * Create an event using a verified JWT.
 */
export async function createCommunityEvent(
  input: CreateEventInput,
  token: string
): Promise<CreatedEvent> {
  const response = await fetch(
    `${API_BASE_URL}/api/events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    }
  );

  const result =
    (await response.json()) as CreateEventResponse;

  // Handle validation errors and failed requests.
  if (!response.ok || !result.success) {
    const fieldMessages = result.errors
      ? Object.values(result.errors)
          .flatMap((messages) => messages ?? [])
      : [];

    throw new Error(
      fieldMessages[0] ||
        result.message ||
        `Unable to create event (HTTP ${response.status})`
    );
  }

  if (!result.data?.id) {
    throw new Error(
      "Event was created, but the API did not return an event ID."
    );
  }

  return result.data;
}
