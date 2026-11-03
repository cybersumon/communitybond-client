
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  HeartHandshake,
  ShieldCheck,
  Users,
} from "lucide-react";

import CreateEventForm from "@/components/events/CreateEventForm";

/**
 * Create Event Page
 *
 * PURPOSE:
 * Display the premium event creation form.
 *
 * AUTH:
 * The form checks the Better Auth session.
 * Express verifies JWT before saving.
 */

export const metadata: Metadata = {
  title: "Create Event | CommunityBond",
  description:
    "Create a community initiative and make a positive impact.",
};

export default function CreateEventPage() {
  return (
    <main className="min-h-screen bg-(--color-background)">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Back navigation. */}
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-muted) transition hover:text-(--color-primary)"
        >
          <ArrowLeft size={17} />
          Back to Events
        </Link>

        {/* Page heading. */}
        <div className="mt-8 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--color-border) px-4 py-2 text-xs font-bold text-(--color-primary)">
            <HeartHandshake size={16} />
            Make a Difference
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-(--color-foreground) sm:text-4xl">
            Create a New Event
          </h1>

          <p className="mt-4 text-sm leading-7 text-(--color-muted) sm:text-base">
            Every great community initiative starts with
            an idea. Share yours and bring people together.
          </p>
        </div>

        {/* Main layout. */}
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Main form card. */}
          <section className="min-w-0 rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm sm:p-8">
            <CreateEventForm />
          </section>

          {/* Helpful information sidebar. */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6">
              <h2 className="text-base font-bold text-(--color-foreground)">
                Before You Publish
              </h2>

              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-(--color-primary)"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-(--color-foreground)">
                      Provide accurate details
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-(--color-muted)">
                      Help volunteers understand the
                      event purpose, place and schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users
                    size={20}
                    className="mt-0.5 shrink-0 text-(--color-primary)"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-(--color-foreground)">
                      Make participation easy
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-(--color-muted)">
                      Explain what community members
                      can contribute.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HeartHandshake
                    size={20}
                    className="mt-0.5 shrink-0 text-(--color-primary)"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-(--color-foreground)">
                      Lead with kindness
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-(--color-muted)">
                      Encourage respectful and positive
                      community action.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="px-2 text-xs leading-6 text-(--color-muted)">
              Your event will be saved to CommunityBond
              after the server validates your submission.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
