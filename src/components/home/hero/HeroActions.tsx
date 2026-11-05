
import Link from "next/link";

export default function HeroActions() {
  return (
    <div className="mt-9 flex flex-wrap gap-4">

      {/* Primary action: discover available events. */}
      <Link
        href="/upcoming-events"
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#176B50] px-7 py-3 font-semibold text-white shadow-lg shadow-green-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#11513D]"
      >
        Explore Events
        <span className="ml-2" aria-hidden="true">↗</span>
      </Link>

      {/* Secondary action: create a community event. */}
      <Link
        href="/create-event"
        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-(--color-primary) px-7 py-3 font-semibold text-(--color-primary) transition-colors hover:bg-(--color-surface)"
      >
        Create an Event
      </Link>
    </div>
  );
}
