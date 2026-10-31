import Link from "next/link";

/**
 * HeroSection Component
 *
 * PURPOSE:
 * Introduce CommunityBond and guide visitors to
 * discover community service events.
 *
 * HOW:
 * Uses a large responsive heading, description and
 * two call-to-action links.
 *
 * LEARNING:
 * JSX, responsive Tailwind classes, layout and links.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F0F8F3]">
      <div className="mx-auto grid min-h-[580px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">

        {/* Left column: heading, description and buttons. */}
        <div className="max-w-2xl">

          {/* Small category badge. */}
          <p className="mb-6 inline-flex rounded-full bg-[#DDF3E7] px-4 py-2 text-sm font-semibold text-[#176B50]">
            Together for a Better Tomorrow
          </p>

          {/* Main website heading. */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#142B25] sm:text-5xl lg:text-6xl">
            Small Acts.
            <span className="block text-[#176B50]">
              Big Impact.
            </span>
          </h1>

          {/* Short description of the platform. */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover local causes, connect with volunteers,
            and take meaningful action to build a kinder,
            stronger community.
          </p>

          {/* Primary and secondary actions. */}
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/upcoming-events"
              className="rounded-xl bg-[#176B50] px-7 py-4 font-semibold text-white transition-colors hover:bg-[#11513D]"
            >
              Explore Events
            </Link>

            <Link
              href="/create-event"
              className="rounded-xl border border-[#176B50] px-7 py-4 font-semibold text-[#176B50] transition-colors hover:bg-[#DDF3E7]"
            >
              Create an Event
            </Link>
          </div>
        </div>

        {/* Right column: temporary visual presentation.
            We will replace this with a real image composition. */}
        <div className="flex min-h-80 items-center justify-center rounded-[2rem] bg-[#D8EEE1] p-8">
          <div className="max-w-sm text-center">
            <span className="text-6xl" aria-hidden="true">
              🌱
            </span>
            <h2 className="mt-5 text-2xl font-bold text-[#176B50]">
              Growing Stronger Together
            </h2>
            <p className="mt-3 text-slate-600">
              Every positive change begins with people
              who care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}