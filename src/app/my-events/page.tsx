
import type { Metadata } from "next";

import MyEventsDashboard from "@/components/events/MyEventsDashboard";

/**
 * My Events Page
 *
 * PURPOSE:
 * Display the authenticated user's
 * event management dashboard.
 *
 * The dashboard handles session verification
 * and fetches data from the protected API.
 */

export const metadata: Metadata = {
  title: "My Events | CommunityBond",
  description:
    "View and manage your community events.",
};

export default function MyEventsPage() {
  return (
    <main className="min-h-screen bg-(--color-background)">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <MyEventsDashboard />
      </div>
    </main>
  );
}
