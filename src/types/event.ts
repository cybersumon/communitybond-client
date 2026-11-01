
/**
 * EventType
 *
 * Restricts event categories to supported values.
 */
export type EventType =
  | "Cleanup"
  | "Plantation"
  | "Donation"
  | "Education"
  | "Healthcare"
  | "Other";

/**
 * EventOrganizer
 *
 * PURPOSE:
 * Store public organizer information for event cards.
 *
 * WHY:
 * Users should know who created an event.
 *
 * NOTE:
 * Real organizer data will come from Better Auth
 * and the Express API, not from the event form.
 */
export interface EventOrganizer {
  id: string;
  name: string;
  photoURL?: string | null;
}

/**
 * CommunityEvent
 *
 * Represents an event returned by our API.
 */
export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
  createdAt: string;

  // Public information about the event creator.
  organizer: EventOrganizer;
}
