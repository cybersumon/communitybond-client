
import Link from "next/link";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import AuthNav from "../shared/AuthNav";

/**
 * Navbar Component
 *
 * PURPOSE:
 * Assemble the desktop and mobile navigation.
 *
 * All interactive features remain in their own
 * independent components.
 */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-surface) backdrop-blur-md">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">

        {/* Shared branding. */}
        <Logo />

        {/* Desktop links. */}
        <NavLinks />

        {/* Navbar actions. */}
        <div className="flex items-center gap-3">

          {/* Theme toggle works on all screen sizes. */}
          <ThemeToggle />
           <AuthNav />

          {/* Desktop login button. */}
          {/* <Link
            href="/login"
            className="hidden rounded-xl bg-[#176B50] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#11513D] md:inline-flex"
          >
            Login
          </Link> */}

          {/* Mobile navigation component. */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
