
import HeroActions from "./HeroActions";

export default function HeroContent() {
  return (
    <div className="relative z-10 max-w-2xl">

      {/* Small introductory label. */}
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-4 py-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-emerald-500"
        />

        <span className="text-xs font-semibold tracking-wide text-(--color-primary) sm:text-sm">
          TOGETHER FOR A BETTER TOMORROW
        </span>
      </div>

      {/* Main SEO-friendly heading. */}
      <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-(--color-foreground) sm:text-5xl lg:text-6xl xl:text-7xl">
        Small Acts.
        <span className="mt-2 block text-(--color-primary)">
          Big Impact.
        </span>
      </h1>

      {/* Explain the purpose of CommunityBond. */}
      <p className="mt-7 max-w-xl text-base leading-8 text-(--color-muted) sm:text-lg">
        Discover meaningful community events, connect
        with passionate volunteers, and turn simple acts
        of kindness into lasting positive change.
      </p>

      {/* Independent call-to-action component. */}
      <HeroActions />

      {/* Supportive message below the actions. */}
      <p className="mt-8 text-sm text-(--color-muted)">
        A stronger community starts with you.
      </p>
    </div>
  );
}
