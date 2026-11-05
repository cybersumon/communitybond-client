
import type { Metadata } from "next";

import JoinedEventsDashboard from "@/components/events/JoinedEventsDashboard";



export const metadata: Metadata = {
  title: "My Joined Events | CommunityBond",
  description:
    "Track the community events you have joined and manage your volunteer registrations.",
};

export default function MyJoinedEventsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <JoinedEventsDashboard />
      </div>
    </main>
  );
}
