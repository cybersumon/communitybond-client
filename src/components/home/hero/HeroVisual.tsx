
import Image from "next/image";
import HeroFloatingCard from "./HeroFloatingCard";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl pb-7 sm:pb-8">

      {/* Decorative frame around the photograph. */}
      <div className="relative h-95 overflow-hidden rounded-4xl bg-(--color-surface) shadow-2xl shadow-black/10 sm:h-120 lg:h-135">

        {/* Fill the available space with a cropped image. */}
        <Image
          src="/images/community-hero.jpg"
          alt="Community volunteers working together on a social initiative"
          fill
          preload
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
          className="object-cover"
        />

        {/* Subtle gradient improves visual depth. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent"
        />
      </div>

      {/* Overlay a separate information component. */}
      <HeroFloatingCard />
    </div>
  );
}
