
/**
 * Props received by the EventDateBadge.
 */
type EventDateBadgeProps = {
  date: string;
};

/**
 * EventDateBadge
 *
 * PURPOSE:
 * Show the event month and day in a compact badge.
 *
 * HOW:
 * Intl.DateTimeFormat formats the supplied ISO date.
 * Asia/Dhaka ensures consistent Bangladesh dates.
 */
export default function EventDateBadge({
  date,
}: EventDateBadgeProps) {
  const eventDate = new Date(date);

  // Convert the date into a short month name.
  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "Asia/Dhaka",
  }).format(eventDate);

  // Extract the day of the month.
  const day = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(eventDate);

  return (
    <div className="absolute left-4 top-4 z-10 flex min-w-15 flex-col items-center rounded-xl bg-white px-3 py-2 text-[#142B25] shadow-lg">
      {/* Month and day remain independent for styling. */}
      <span className="text-xs font-semibold uppercase text-[#176B50]">
        {month}
      </span>
      <span className="text-xl font-extrabold">
        {day}
      </span>
    </div>
  );
}
