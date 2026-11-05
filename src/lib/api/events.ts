
import "server-only";

import type { CommunityEvent } from "@/types/event";
import type {
  ApiListResponse,
  ApiItemResponse,
} from "@/types/api";


// Read the API address from .env.local.
const API_BASE_URL =
  process.env.API_BASE_URL || "http://localhost:5000";

async function fetchFromApi<T>(
  endpoint: string
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }
  );

  // Handle HTTP errors before reading data.
  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as T;
}

export async function getEvents(): Promise<
  CommunityEvent[]
> {
  const result = await fetchFromApi<
    ApiListResponse<CommunityEvent>
  >("/api/events");

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("Invalid events API response");
  }

  return result.data;
}


export async function getRecentEvents(): Promise<
  CommunityEvent[]
> {
  const result = await fetchFromApi<
    ApiListResponse<CommunityEvent>
  >("/api/events/recent");

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("Invalid recent events API response");
  }

  return result.data;
}


export async function getEventById(
  id: string
): Promise<CommunityEvent | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }
  );

  // A missing event should return null.
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch event: ${response.status}`
    );
  }

  const result =
    (await response.json()) as ApiItemResponse<CommunityEvent>;

  if (!result.success || !result.data) {
    throw new Error("Invalid event details response");
  }

  return result.data;
}
