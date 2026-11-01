
import { CheckCircle2, ClipboardList } from "lucide-react";

/**
 * VolunteerGuidelines
 *
 * PURPOSE:
 * Display preparation guidelines for event volunteers.
 *
 * WHY:
 * Users should understand basic participation
 * instructions before joining an event.
 *
 * HOW:
 * A static array stores each guideline.
 * Array.map() renders the guidelines as list items.
 *
 * FUTURE:
 * We can allow organizers to provide their own
 * guidelines when the event creation API is ready.
 */

// General guidelines for community volunteering.
const guidelines = [
  "Arrive at least 15 minutes before the event.",
  "Wear comfortable clothing suitable for the activity.",
  "Follow the event organizer's instructions.",
];

/**
 * Reusable VolunteerGuidelines component.
 *
 * No client state is needed, so this remains
 * a React Server Component.
 */
export default function VolunteerGuidelines() {
  return (
    <section
      aria-labelledby="volunteer-guidelines-heading"
      className="rounded-xl bg-(--color-hero) p-3 sm:p-4"
    >
      {/* Compact section heading. */}
      <h3
        id="volunteer-guidelines-heading"
        className="flex items-center gap-2 text-sm font-bold text-(--color-foreground)"
      >
        <ClipboardList
          size={18}
          className="text-(--color-primary)"
          aria-hidden="true"
        />
        Volunteer Guidelines
      </h3>

      {/* Render all preparation guidelines. */}
      <ul className="mt-2 space-y-1.5">
        {guidelines.map((guideline) => (
          <li
            key={guideline}
            className="flex items-start gap-2 text-xs leading-5 text-(--color-muted) sm:text-sm"
          >
            {/* Decorative guideline icon. */}
            <CheckCircle2
              size={15}
              className="mt-0.5 shrink-0 text-(--color-primary)"
              aria-hidden="true"
            />

            <span>{guideline}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
