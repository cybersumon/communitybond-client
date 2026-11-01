import Link from "next/link";

/**
 * Logo Component
 *
 * WHY:
 * Display a consistent brand identity in the website.
 *
 * HOW:
 * Next.js Link allows navigation to the homepage
 * without unnecessary full-page browser reloads.
 *
 * REUSABILITY:
 * The same Logo can be used in Navbar and Footer.
 */
export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="CommunityBond Home"
      className="inline-flex items-center gap-3"
    >
      {/* Simple brand icon using text for our first lesson. */}
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176B50] text-xl font-bold text-white"
      >
        C
      </span>

      {/* Website name and tagline. */}
      <span className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">
          CommunityBond
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-(--color-primary)">
  Together for Good
</span>
      </span>
    </Link>
  );
}