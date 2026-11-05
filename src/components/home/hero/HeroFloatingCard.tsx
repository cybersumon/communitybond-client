
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
