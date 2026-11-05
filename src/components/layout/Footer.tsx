
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Mail,
  MapPin,
  PlusCircle,
  Users,
  Heart,
} from "lucide-react";

import Logo from "@/components/layout/Logo";

const exploreLinks = [
  {
    label: "Upcoming Events",
    href: "/upcoming-events",
  },
  {
    label: "Recent Events",
    href: "/#recent-events",
  },
  {
    label: "Create an Event",
    href: "/create-event",
  },
];

const communityLinks = [
  {
    label: "My Events",
    href: "/my-events",
  },
  {
    label: "My Joined Events",
    href: "/my-joined-events",
  },
  {
    label: "Volunteer Opportunities",
    href: "/upcoming-events",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#062e2b] text-white">
      {/* Background decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-teal-400/10 blur-[100px]"
      />

      {/* Main footer content */}
      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1.1fr] lg:gap-10">

          {/* COLUMN 1: Brand information */}
          <div className="max-w-sm">

            {/* Official CommunityBond Logo */}
            <div className="inline-flex max-w-full rounded-2xl bg-white px-4 py-2 shadow-lg shadow-black/10">
              <Logo />
            </div>

            {/* Brand Description */}
            <p className="mt-5 text-sm leading-7 text-emerald-50/70">
              Bringing communities together through
              meaningful events, volunteer opportunities,
              and shared acts of kindness.
            </p>

            {/* Community mission badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3.5 py-2 text-xs font-semibold text-emerald-200">
              <Heart
                size={14}
                aria-hidden="true"
              />
              Small Actions. Lasting Impact.
            </div>
          </div>

          {/* COLUMN 2: Explore links */}
          <nav aria-label="Explore CommunityBond">
            <h2 className="text-sm font-bold tracking-wide text-white">
              Explore
            </h2>

            <ul className="mt-5 space-y-3.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-emerald-50/65 transition-colors hover:text-emerald-300"
                  >
                    <ArrowRight
                      size={13}
                      aria-hidden="true"
                      className="opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMN 3: Community links */}
          <nav aria-label="Community dashboard links">
            <h2 className="text-sm font-bold tracking-wide text-white">
              Community
            </h2>

            <ul className="mt-5 space-y-3.5">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-emerald-50/65 transition-colors hover:text-emerald-300"
                  >
                    <ArrowRight
                      size={13}
                      aria-hidden="true"
                      className="opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMN 4: Get involved */}
          <div>
            <h2 className="text-sm font-bold tracking-wide text-white">
              Get Involved
            </h2>

            <p className="mt-5 text-sm leading-6 text-emerald-50/65">
              Every small action can create a
              meaningful difference.
            </p>

            <Link
              href="/create-event"
              className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-200"
            >
              <PlusCircle
                size={17}
                aria-hidden="true"
              />
              Start an Initiative
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/#cause-alerts"
              className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-200 transition hover:text-white"
            >
              <Mail
                size={16}
                aria-hidden="true"
              />
              Subscribe to Cause Alerts
            </Link>
          </div>
        </div>

        {/* Platform mission strip */}
        <div className="mt-12 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-3 sm:p-6">
          <div className="flex items-center gap-3">
            <CalendarDays
              size={20}
              className="shrink-0 text-emerald-300"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                Discover Events
              </p>
              <p className="text-xs text-emerald-50/60">
                Find local initiatives
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users
              size={20}
              className="shrink-0 text-emerald-300"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                Join Volunteers
              </p>
              <p className="text-xs text-emerald-50/60">
                Make a positive impact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin
              size={20}
              className="shrink-0 text-emerald-300"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                Build Community
              </p>
              <p className="text-xs text-emerald-50/60">
                Connect through kindness
              </p>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-10 border-t border-white/10" />

        {/* Copyright and bottom navigation */}
        <div className="flex flex-col gap-4 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-emerald-50/55">
            © {year} CommunityBond. All rights reserved.
          </p>

          <p className="inline-flex items-center justify-center gap-1.5 text-xs text-emerald-50/55">
            Made with
            <Heart
              size={13}
              className="fill-emerald-300 text-emerald-300"
              aria-label="love"
            />
            for stronger communities.
          </p>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-linear-to-r from-emerald-600 via-teal-300 to-emerald-600"
      />
    </footer>
  );
}
