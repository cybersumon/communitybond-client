
import FeatureCard from "./FeatureCard";
import { features } from "./featuresData";

/**
 * FeatureGrid
 *
 * PURPOSE:
 * Generate a responsive grid of feature cards.
 *
 * HOW:
 * Array.map() creates one FeatureCard for each item.
 *
 * RESPONSIVE:
 * Mobile: 1 column
 * Tablet: 2 columns
 * Desktop: 4 columns
 */
export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          index={index}
        />
      ))}
    </div>
  );
}
