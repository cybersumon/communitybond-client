
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import RecentEventsSection from "@/components/home/RecentEventsSection";

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

       {/* Latest six upcoming community events. */}
      <RecentEventsSection />
    </main>
  );
}
