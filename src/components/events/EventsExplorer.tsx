
"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { CommunityEvent } from "@/types/event";
import EventGrid from "./EventGrid";

type EventsExplorerProps = {
  events: CommunityEvent[];
};

export default function EventsExplorer({
  events,
}: EventsExplorerProps) {

  const [searchText, setSearchText] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      events
        .map((event) => event.eventType.trim())
        .filter(Boolean)
    );

    return Array.from(uniqueCategories).sort(
      (a, b) => a.localeCompare(b)
    );
  }, [events]);


  const filteredEvents = useMemo(() => {
    const keyword = searchText
      .trim()
      .toLowerCase();

    return events.filter((event) => {
      // Category matching.
      const matchesCategory =
        selectedCategory === "all" ||
        event.eventType.toLowerCase() ===
          selectedCategory.toLowerCase();

      // Search matching.
      const searchableValues = [
        event.title,
        event.description,
        event.eventType,
        event.location,
        event.organizer?.name ?? "",
      ];

      const matchesSearch =
        keyword.length === 0 ||
        searchableValues.some((value) =>
          value.toLowerCase().includes(keyword)
        );

      return matchesCategory && matchesSearch;
    });
  }, [
    events,
    searchText,
    selectedCategory,
  ]);

  const hasActiveFilters =
    searchText.trim().length > 0 ||
    selectedCategory !== "all";

  function clearFilters() {
    setSearchText("");
    setSelectedCategory("all");
  }

  return (
    <div className="space-y-8">
      {/* Search and category filter panel. */}
      <section
        aria-label="Find community events"
        className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm sm:p-6"
      >
        <div className="flex flex-col gap-5">
          {/* Search and Clear controls. */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--color-muted)"
              />

              <input
                type="search"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search by event, location, category..."
                aria-label="Search community events"
                className="w-full rounded-xl border border-(--color-border) bg-(--color-background) py-3.5 pl-12 pr-4 text-sm text-(--color-foreground) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-(--color-border) px-4 py-3 text-sm font-semibold text-(--color-foreground) transition hover:border-(--color-primary) hover:text-(--color-primary)"
              >
                <RotateCcw
                  size={16}
                  aria-hidden="true"
                />
                Clear Filters
              </button>
            )}
          </div>

          {/* Category filter heading. */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-(--color-foreground)">
              <SlidersHorizontal
                size={17}
                className="text-(--color-primary)"
                aria-hidden="true"
              />
              Filter by Category
            </p>

            <p
              aria-live="polite"
              className="flex items-center gap-2 text-xs font-medium text-(--color-muted)"
            >
              <CalendarDays
                size={15}
                aria-hidden="true"
              />
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1
                ? "event"
                : "events"}{" "}
              found
            </p>
          </div>

          {/* Dynamic category buttons. */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setSelectedCategory("all")
              }
              aria-pressed={
                selectedCategory === "all"
              }
              className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === "all"
                  ? "border-(--color-primary) bg-(--color-primary) text-white"
                  : "border-(--color-border) bg-(--color-background) text-(--color-muted) hover:border-(--color-primary) hover:text-(--color-primary)"
              }`}
            >
              All Categories
            </button>

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                aria-pressed={
                  selectedCategory === category
                }
                className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "border-(--color-primary) bg-(--color-primary) text-white"
                    : "border-(--color-border) bg-(--color-background) text-(--color-muted) hover:border-(--color-primary) hover:text-(--color-primary)"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Active filter summary. */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 border-t border-(--color-border) pt-4">
              <span className="text-xs font-medium text-(--color-muted)">
                Active filters:
              </span>

              {searchText.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-(--color-primary)/10 px-3 py-1.5 text-xs font-semibold text-(--color-primary)"
                >
                  Search: {searchText.trim()}
                  <X
                    size={13}
                    aria-hidden="true"
                  />
                </button>
              )}

              {selectedCategory !== "all" && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory("all")
                  }
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-(--color-primary)/10 px-3 py-1.5 text-xs font-semibold text-(--color-primary)"
                >
                  {selectedCategory}
                  <X
                    size={13}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Events Grid. */}
      <section
        aria-label="Upcoming community events"
        className="space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-(--color-foreground) sm:text-2xl">
              Explore Events
            </h2>

            <p className="mt-1 text-sm text-(--color-muted)">
              Discover initiatives happening near you.
            </p>
          </div>

          <p className="text-sm font-semibold text-(--color-muted)">
            Showing {filteredEvents.length} of{" "}
            {events.length}
          </p>
        </div>

        <EventGrid
          events={filteredEvents}
          returnTo="/upcoming-events"
          emptyTitle="No matching events found"
          emptyDescription="Try another keyword or category to discover more community initiatives."
          showCreateButton={
            !hasActiveFilters &&
            events.length === 0
          }
        />

        {/* Reset filters after empty search. */}
        {filteredEvents.length === 0 &&
          hasActiveFilters && (
            <div className="text-center">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-(--color-primary) hover:underline"
              >
                <RotateCcw
                  size={16}
                  aria-hidden="true"
                />
                Reset all filters
              </button>
            </div>
          )}
      </section>
    </div>
  );
}


