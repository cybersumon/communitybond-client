
import type { CommunityEvent } from "@/types/event";

/**
 * DEMO EVENTS
 *
 * WHY:
 * Build and test the frontend before the backend is ready.
 *
 * IMPORTANT:
 * These are sample events, not real database records.
 * They will be removed when MongoDB API integration is done.
 *
 * Images temporarily reuse our local hero photograph.
 */
export const demoEvents: CommunityEvent[] = [
  {
    id: "demo-1",
    title: "Green Dhaka Plantation Drive",
    description: "Help create a greener community,Help create a greener community,Help create a greener community.",
    eventType: "Plantation",
    thumbnailUrl: "/images/community-hero.jpg",
    location: "Dhanmondi, Dhaka",
    eventDate: "2027-01-15T09:00:00+06:00",
    createdAt: "2026-10-31T10:00:00+06:00",
     organizer: {
    id: "demo-user-1",
    name: "Sumon Ahmed",
    photoURL: null,
  }
  },
  {
    id: "demo-2",
    title: "Winter Warmth Distribution",
    description: "Support families during winter.",
    eventType: "Donation",
    thumbnailUrl: "/images/community-hero.jpg",
    location: "Mohammadpur, Dhaka",
    eventDate: "2027-01-20T10:00:00+06:00",
    createdAt: "2026-10-30T09:00:00+06:00",
   organizer: {
    id: "demo-user-1",
    name: "Sumon Ahmed",
    photoURL: null,
   
  }
},

  {
    id: "demo-3",
    title: "Clean Our Neighborhood",
    description: "Join a community cleanup drive.",
    eventType: "Cleanup",
    thumbnailUrl: "/images/community-hero.jpg",
    location: "Mirpur 10, Dhaka",
    eventDate: "2027-02-05T08:30:00+06:00",
    createdAt: "2026-10-29T09:00:00+06:00",
     organizer: {
    id: "demo-user-1",
    name: "Sumon Ahmed",
    photoURL: null,
  }
  },
  {
    id: "demo-4",
    title: "Books for Every Child",
    description: "Bring learning materials to children.",
    eventType: "Education",
    thumbnailUrl: "/images/community-hero.jpg",
    location: "Uttara, Dhaka",
    eventDate: "2027-02-12T11:00:00+06:00",
    createdAt: "2026-10-28T09:00:00+06:00",
     organizer: {
    id: "demo-user-1",
    name: "Sumon Ahmed",
    photoURL: null,
  }
  },

  {
    id: "demo-5",
    title: "Community Health Awareness",
    description: "Help neighbors learn about wellness.",
    eventType: "Healthcare",
    thumbnailUrl: "/images/community-hero.jpg",
    location: "Gulshan, Dhaka",
    eventDate: "2027-03-08T10:00:00+06:00",
    createdAt: "2026-10-27T09:00:00+06:00",
     organizer: {
    id: "demo-user-1",
    name: "Sumon Ahmed",
    photoURL: null,
  }
  },

  {
    id: "demo-6",
    title: "Food for Families",
    description: "Volunteer to distribute essential meals.",
    eventType: "Donation",
    thumbnailUrl: "/images/community-hero.jpg",
    location: "Banani, Dhaka",
    eventDate: "2027-03-20T09:30:00+06:00",
    createdAt: "2026-10-26T09:00:00+06:00",
     organizer: {
    id: "demo-user-1",
    name: "Sumon Ahmed",
    photoURL: null,
  }
  },
];
