
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureGrid from "./features/FeatureGrid";

/**
 * FeaturesSection
 *
 * PURPOSE:
 * Combine a reusable section heading
 * with the feature cards grid.
 *
 * COMPONENT TREE:
 *
 * FeaturesSection
 *   ├── SectionHeading
 *   └── FeatureGrid
 *        └── FeatureCard (repeated)
 *
 * WHY:
 * This section manages composition, not card details.
 */
export default function FeaturesSection() {
  return (
    <section
      aria-labelledby="features-heading"
      className="bg-(--color-background) px-5 py-20 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Consistent heading used across homepage sections. */}
        <div id="features-heading">
          <SectionHeading
            label="Why CommunityBond?"
            title="Small Actions. Meaningful Change."
            description="Everything you need to discover local causes, connect with compassionate people, and create a positive impact in your community."
          />
        </div>

        {/* Render all feature cards. */}
        <FeatureGrid />
      </div>
    </section>
  );
}
