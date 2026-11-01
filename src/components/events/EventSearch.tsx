
import { Search, X } from "lucide-react";

/**
 * EventSearch Props
 *
 * value: Current search text.
 * onChange: Function to update search text.
 */
type EventSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * EventSearch
 *
 * PURPOSE:
 * Allow users to search events by typing.
 *
 * HOW:
 * The input calls onChange whenever the user types.
 * The parent component controls the input value.
 */
export default function EventSearch({
  value,
  onChange,
}: EventSearchProps) {
  return (
    <div className="relative w-full">
      {/* Decorative search icon. */}
      <Search
        size={19}
        aria-hidden="true"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-muted)"
      />

      {/* Controlled search input. */}
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search events or locations..."
        aria-label="Search community events"
        className="h-13 w-full rounded-2xl border border-(--color-border) bg-(--color-surface) py-3 pl-12 pr-12 text-sm text-(--color-foreground) outline-none transition-colors placeholder:text-(--color-muted) focus:border-(--color-primary)"
      />

      {/* Clear button only appears when search has text. */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-(--color-muted) hover:text-(--color-primary)"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
