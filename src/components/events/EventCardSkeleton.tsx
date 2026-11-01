
/**
 * EventCardSkeleton
 *
 * PURPOSE:
 * Show placeholder shapes while event data is loading.
 *
 * WHY:
 * Skeletons reduce perceived waiting time and
 * prevent an empty page during API requests.
 *
 * NOTE:
 * We will connect this component to an actual
 * loading state when the backend API is implemented.
 */
export default function EventCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface)"
    >
      {/* Image placeholder. */}
      <div className="h-56 animate-pulse bg-(--color-hero)" />

      {/* Text and button placeholders. */}
      <div className="space-y-4 p-6">
        <div className="h-5 w-24 animate-pulse rounded-full bg-(--color-hero)" />
        <div className="h-7 w-4/5 animate-pulse rounded-lg bg-(--color-hero)" />
        <div className="h-5 w-3/5 animate-pulse rounded-lg bg-(--color-hero)" />
        <div className="h-5 w-2/3 animate-pulse rounded-lg bg-(--color-hero)" />
        <div className="h-12 animate-pulse rounded-xl bg-(--color-hero)" />
      </div>
    </div>
  );
}
