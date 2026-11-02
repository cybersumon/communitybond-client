
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
 * Events are loaded from the Express API
 * by the parent Next.js Server Component.
 */
type EventsExplorerProps = {
  events: CommunityEvent[];
};

/**
 * EventsExplorer
 *
 * PURPOSE:
 * Manage client-side search and category filtering.
 *
 * DATA FLOW:
 * MongoDB -> Express API -> Next.js Page
 * -> EventsExplorer -> EventGrid
 *
 * NOTE:
 * The backend already filters upcoming events
 * and sorts them by event date.
 */
export default function EventsExplorer({
  events,
}: EventsExplorerProps) {
  // Search input value.
  const [search, setSearch] = useState("");

  // Selected category.
  const [category, setCategory] =
    useState<EventCategory>("All");

  /**
   * Filter the events supplied by the server.
   *
   * We do not filter by date again because
   * GET /api/events already returns upcoming events.
   */
  const filteredEvents = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return events.filter((event) => {
      // Match searchable event fields.
      const matchesSearch =
        event.title.toLowerCase().includes(searchText) ||
        event.location.toLowerCase().includes(searchText) ||
        event.description.toLowerCase().includes(searchText) ||
        event.organizer.name
          .toLowerCase()
          .includes(searchText);

      // Match the selected event category.
      const matchesCategory =
        category === "All" ||
        event.eventType === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  /**
   * Reset search and category filters.
   */
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

      {/* Result count and reset button. */}
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

      {/* Existing event cards and grid. */}
      <EventGrid events={filteredEvents} />
    </div>
  );
}
