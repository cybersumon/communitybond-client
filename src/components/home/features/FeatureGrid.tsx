
import FeatureCard from "./FeatureCard";
import { features } from "./featuresData";

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
