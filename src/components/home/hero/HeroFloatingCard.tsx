
/**
* HeroFloatingCard
*
* উদ্দেশ্য:
* হিরো ইমেজের ওপর একটি উৎসাহব্যঞ্জক বার্তা প্রদর্শন করা। 
*
* পদ্ধতি:
* এই কার্ডটি একটি রিলেটিভলি পজিশনড (relatively positioned) ইমেজ কন্টেইনারের ভেতরে অ্যাবসোলিউট পজিশনিং (absolute positioning) ব্যবহার করে। 
*
* দ্রষ্টব্য:
* এটি একটি স্ট্যাটিক উপস্থাপনা, ডেটাবেস থেকে প্রাপ্ত কোনো তথ্য নয়। 
*/
export default function HeroFloatingCard() {
  return (
    <div className="absolute -bottom-5 left-4 z-10 max-w-62.5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-xl sm:-left-6 sm:p-5">

      {/* Icon and title shown inside the card. */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#176B50] text-xl text-white">
          <span aria-hidden="true">♥</span>
        </div>

        <div>
          <h3 className="font-bold text-(--color-foreground)">
            Make a Difference
          </h3>

          <p className="mt-1 text-xs leading-5 text-(--color-muted)">
            Find a cause that matters to you.
          </p>
        </div>
      </div>
    </div>
  );
}
