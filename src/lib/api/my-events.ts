
import type { CommunityEvent } from "@/types/event";


type MyEventsResponse = {
  success: boolean;
  message?: string;
  count?: number;
  data?: CommunityEvent[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000";

export async function getMyEvents(
  token: string,
  signal?: AbortSignal
): Promise<CommunityEvent[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/my`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Your session has expired. Please sign in again."
        : `Unable to load events (HTTP ${response.status}).`
    );
  }

  const result =
    (await response.json()) as MyEventsResponse;

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(
      result.message || "Invalid API response."
    );
  }

  return result.data;
}
