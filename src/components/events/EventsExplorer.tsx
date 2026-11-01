
"use client";

import { useMemo, useState } from "react";

import type { CommunityEvent } from "@/types/event";
import EventGrid from "./EventGrid";
import EventSearch from "./EventSearch";
import EventCategoryFilter from "./EventCategoryFilter";

import type { EventCategory } from "./EventCategoryFilter";

/**
 * EventsExplorer Props
 *
 * events: The event collection supplied by the page.
 * currentTime: A stable server-generated timestamp.
 */
type EventsExplorerProps = {
  events: CommunityEvent[];
  currentTime: string;
};

/**
 * EventsExplorer
 *
 * PURPOSE:
 * Manage search, category filtering and event sorting.
 *
 * WHY "use client":
 * Search and filter buttons require React state
 * and browser interaction.
 *
 * DATA FLOW:
 * Input -> State -> Filter -> EventGrid -> EventCard
 */
export default function EventsExplorer({
  events,
  currentTime,
}: EventsExplorerProps) {
  // Store the text entered in the search input.
  const [search, setSearch] = useState("");

  // Store the currently selected event category.
  const [category, setCategory] =
    useState<EventCategory>("All");

  /**
   * Calculate the visible events.
   *
   * useMemo caches the result until its dependencies change.
   * This is optional for small lists but useful to learn.
   */
  const filteredEvents = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const cutoff = new Date(currentTime).getTime();

    return events
      .filter((event) => {
        // Hide events whose dates have already passed.
        const isUpcoming =
          new Date(event.eventDate).getTime() > cutoff;

        // Match title or location against the search.
        const matchesSearch =
          event.title.toLowerCase().includes(searchText) ||
          event.location.toLowerCase().includes(searchText) ||
           event.description.toLowerCase().includes(searchText)||
          event.organizer.name.toLowerCase().includes(searchText);

        // Allow every category when "All" is selected.
        const matchesCategory =
          category === "All" || event.eventType === category;

        return isUpcoming && matchesSearch && matchesCategory;
      })
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() -
          new Date(b.eventDate).getTime()
      );
  }, [events, search, category, currentTime]);

  // Reset both filters to their initial state.
  function clearFilters() {
    setSearch("");
    setCategory("All");
  }

  return (
    <div>
      {/* Search and category controls. */}
      <div className="mb-10 space-y-5 rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 sm:p-7">
        <EventSearch value={search} onChange={setSearch} />

        <EventCategoryFilter
          selected={category}
          onChange={setCategory}
        />
      </div>

      {/* Result count and filter reset. */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p
          role="status"
          className="text-sm text-(--color-muted)"
        >
          Showing{" "}
          <strong className="text-(--color-foreground)">
            {filteredEvents.length}
          </strong>{" "}
          upcoming events
        </p>

        {(search || category !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer text-sm font-semibold text-(--color-primary) hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Reuse the EventGrid from Lesson 09. */}
      <EventGrid events={filteredEvents} />
    </div>
  );
}
