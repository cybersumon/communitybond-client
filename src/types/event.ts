
export type EventType =
  | "Cleanup"
  | "Plantation"
  | "Donation"
  | "Education"
  | "Healthcare"
  | "Other";

export interface EventOrganizer {
  id: string;
  name: string;
  photoURL?: string | null;
}

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
