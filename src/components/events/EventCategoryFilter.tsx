
import type { EventType } from "@/types/event";


export type EventCategory = "All" | EventType;

const categories: EventCategory[] = [
  "All",
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Healthcare",
  "Other",
];

/**
 * Category filter properties.
 */
type EventCategoryFilterProps = {
  selected: EventCategory;
  onChange: (category: EventCategory) => void;
};

/**
 * EventCategoryFilter
 *
 * PURPOSE:
 * Filter events by their category.
 *
 * HOW:
 * Each button sends its category to the parent.
 * The selected category receives different styling.
 */
export default function EventCategoryFilter({
  selected,
  onChange,
}: EventCategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter events by category"
      className="flex flex-wrap gap-2"
    >
      {categories.map((category) => {
        // Check whether this button is selected.
        const isActive = category === selected;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? "border-[#176B50] bg-[#176B50] text-white"
                : "border-(--color-border) bg-(--color-surface) text-(--color-foreground) hover:border-(--color-primary)"
            }`}
          >
            {category === "All" ? "All Events" : category}
          </button>
        );
      })}
    </div>
  );
}
