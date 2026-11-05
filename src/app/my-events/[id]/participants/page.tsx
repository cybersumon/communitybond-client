
import type { Metadata } from "next";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import EventParticipants from "@/components/events/EventParticipants";


export const metadata: Metadata = {
  title: "Event Volunteers | CommunityBond",
  description:
    "View and manage volunteer registrations for your community event.",
};

export default async function EventParticipantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Back navigation */}
        <Link
          href="/my-events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <ArrowLeft size={16} />
          Back to My Events
        </Link>

        {/* Page header */}
        <div className="mb-8 mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Organizer Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Event Volunteers
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            View registered volunteers and track
            participation in your community event.
          </p>
        </div>

        {/* Protected participants dashboard */}
        <EventParticipants eventId={id} />
      </div>
    </main>
  );
}
