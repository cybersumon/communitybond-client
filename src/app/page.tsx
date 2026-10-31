import HeroSection from "@/components/home/HeroSection";

/**
 * HomePage
 *
 * PURPOSE:
 * Assemble independent homepage sections.
 *
 * Each major section is implemented in its own file.
 */
export default function HomePage() {
  return (
    <main>
      {/* Website introduction and main CTA section. */}
      <HeroSection />
    </main>
  );
}