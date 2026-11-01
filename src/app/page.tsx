
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";

/**
 * HomePage
 *
 * PURPOSE:
 * Compose independent homepage sections.
 *
 * WHY:
 * We keep route files small.
 * Each section has its own component and responsibility.
 */
export default function HomePage() {
  return (
    <main>
      {/* Main hero with headline, image and actions. */}
      <HeroSection />

      {/* Platform feature cards. */}
      <FeaturesSection />
    </main>
  );
}
