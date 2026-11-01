
import HeroContent from "./hero/HeroContent";
import HeroVisual from "./hero/HeroVisual";

/**
 * HeroSection
 *
 * PURPOSE:
 * Combine the hero text and visual components.
 *
 * ARCHITECTURE:
 * HeroSection
 *   ├── HeroContent
 *   │     └── HeroActions
 *   └── HeroVisual
 *         └── HeroFloatingCard
 *
 * WHY:
 * Keep this file small and focused on layout only.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-(--color-hero)">

      {/* Centered responsive hero container. */}
      <div className="mx-auto grid min-h-145 max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">

        {/* Left side: text and action buttons. */}
        <HeroContent />

        {/* Right side: photo and floating card. */}
        <HeroVisual />
      </div>
    </section>
  );
}
