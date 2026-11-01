
import Image from "next/image";
import HeroFloatingCard from "./HeroFloatingCard";

/**
* HeroVisual
*
* উদ্দেশ্য:
* কমিউনিটি স্বেচ্ছাসেবামূলক কার্যক্রমের প্রধান ছবিটি প্রদর্শন করা। 
*
* পদ্ধতি:
* Next.js Image স্থানীয় ছবিটিকে অপ্টিমাইজ করে। 
* প্যারেন্ট এলিমেন্টটিতে রিলেটিভ পজিশনিং (relative positioning) ব্যবহার করা হয়েছে। 
* HeroFloatingCard-টি ছবিটির ওপর অবস্থান করে। 
*
* ছবির অবস্থান:
* public/images/community-hero.jpg
*/
export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl pb-7 sm:pb-8">

      {/* Decorative frame around the photograph. */}
      <div className="relative h-[380px] overflow-hidden rounded-4xl bg-(--color-surface) shadow-2xl shadow-black/10 sm:h-[480px] lg:h-[540px]">

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
