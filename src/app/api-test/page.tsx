
import { getEvents, getRecentEvents } from "@/lib/api/events";


export default async function ApiTestPage() {

  const [events, recentEvents] = await Promise.all([
    getEvents(),
    getRecentEvents(),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">

    
      <div className="mb-8">
        <p className="text-sm font-semibold text-(--color-primary)">
          CommunityBond Backend Integration
        </p>

        <h1 className="mt-2 text-3xl font-bold text-(--color-foreground)">
          API Connection Test
        </h1>

        <p className="mt-2 text-(--color-muted)">
          These events are loaded directly from MongoDB
          through our Express.js API.
        </p>
      </div>

   
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-(--color-border) p-6">
          <p className="text-sm text-(--color-muted)">
            Upcoming Events
          </p>

          <p className="mt-2 text-4xl font-bold text-(--color-foreground)">
            {events.length}
          </p>
        </div>

        <div className="rounded-2xl border border-(--color-border) p-6">
          <p className="text-sm text-(--color-muted)">
            Recently Added Events
          </p>

          <p className="mt-2 text-4xl font-bold text-(--color-foreground)">
            {recentEvents.length}
          </p>
        </div>
      </div>

  
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-(--color-foreground)">
          Events from MongoDB
        </h2>

        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-(--color-border) p-4"
            >
              <h3 className="font-semibold text-(--color-foreground)">
                {event.title}
              </h3>

              <p className="mt-1 text-sm text-(--color-muted)">
                {event.eventType} · {event.location}
              </p>

              <p className="mt-1 break-all text-xs text-(--color-muted)">
                ID: {event.id}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
