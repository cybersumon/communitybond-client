import Link from "next/link";
import Logo from "./Logo";

/**
 * Navbar Component
 *
 * PURPOSE:
 * Show the website branding and main navigation links.
 *
 * HOW:
 * Imports the reusable Logo component and Next.js Link.
 *
 * NOTE:
 * Authentication and mobile menu will be added in
 * a separate lesson using independent components.
 */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        
        {/* Reusable website logo. */}
        <Logo />

        {/* Desktop navigation links. */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-medium transition-colors hover:text-[#176B50]"
          >
            Home
          </Link>

          <Link
            href="/upcoming-events"
            className="font-medium transition-colors hover:text-[#176B50]"
          >
            Upcoming Events
          </Link>
        </div>

        {/* Login navigation; auth state comes later. */}
        <Link
          href="/login"
          className="rounded-xl bg-[#176B50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#11513D]"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}