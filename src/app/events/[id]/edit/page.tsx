
import Link from "next/link";
import EditEventForm from "@/components/events/EditEventForm";

/**
 * Edit Event Page
 *
 * ROUTE:
 * /events/[id]/edit
 *
 * PURPOSE:
 * Display the event editing form.
 *
 * SECURITY:
 * EditEventForm checks the current session.
 * Express API verifies JWT and event ownership.
 */

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/my-events"
          className="mb-6 inline-flex text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          ← Back to My Events
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Edit Event
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage and update your community event.
          </p>
        </div>

        <EditEventForm eventId={id} />
      </div>
    </main>
  );
}
