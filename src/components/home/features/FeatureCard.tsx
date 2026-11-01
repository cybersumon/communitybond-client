
import type { FeatureItem } from "./featuresData";

/**
 * FeatureCard Props
 *
 * WHY:
 * Each card receives one feature object
 * instead of maintaining its own hardcoded data.
 */
type FeatureCardProps = {
  feature: FeatureItem;
  index: number;
};

/**
 * FeatureCard
 *
 * PURPOSE:
 * Display a feature's icon, title and description.
 *
 * HOW:
 * Destructure values from feature.
 * Render the supplied Lucide icon dynamically.
 *
 * ACCESSIBILITY:
 * Decorative icons are hidden from screen readers.
 */
export default function FeatureCard({
  feature,
  index,
}: FeatureCardProps) {
  const { title, description, icon: Icon } = feature;

  // Give the first card a slightly stronger visual treatment.
  const isFeatured = index === 0;

  return (
    <article
      className={`group relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
        isFeatured
          ? "border-[#176B50]/20 bg-(--color-surface)"
          : "border-(--color-border) bg-(--color-surface)"
      }`}
    >
      {/* Icon container with a consistent size. */}
      <div
        className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ${
          isFeatured
            ? "bg-[#176B50] text-white"
            : "bg-(--color-hero) text-(--color-primary)"
        }`}
      >
        <Icon
          aria-hidden="true"
          size={27}
          strokeWidth={1.8}
        />
      </div>

      {/* Feature title. */}
      <h3 className="text-xl font-bold tracking-tight text-(--color-foreground)">
        {title}
      </h3>

      {/* Feature description. */}
      <p className="mt-2 grow text-sm leading-4 text-(--color-muted)">
        {description}
      </p>

      {/* Decorative accent line. */}
      <div
        aria-hidden="true"
        className="mt-7 h-1 w-10 rounded-full bg-[#176B50] transition-all duration-300 group-hover:w-16"
      />
    </article>
  );
}
