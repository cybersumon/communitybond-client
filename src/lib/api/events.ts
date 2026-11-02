
import "server-only";

import type { CommunityEvent } from "@/types/event";
import type {
  ApiListResponse,
  ApiItemResponse,
} from "@/types/api";

/**
 * CommunityBond Events API
 *
 * PURPOSE:
 * Fetch event data from our Express.js backend.
 *
 * BACKEND:
 * http://localhost:5000
 *
 * WHY:
 * Keep API requests in one place instead of
 * repeating fetch() in every React component.
 */

// Read the API address from .env.local.
const API_BASE_URL =
  process.env.API_BASE_URL || "http://localhost:5000";

/**
 * Reusable server-side API fetch function.
 *
 * cache: "no-store" means Next.js requests
 * current data instead of using its Data Cache.
 */
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

/**
 * GET ALL UPCOMING EVENTS
 *
 * Express endpoint:
 * GET /api/events
 */
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

/**
 * GET THE LATEST SIX EVENTS
 *
 * Express endpoint:
 * GET /api/events/recent
 */
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

/**
 * GET SINGLE EVENT DETAILS
 *
 * Express endpoint:
 * GET /api/events/:id
 */
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
