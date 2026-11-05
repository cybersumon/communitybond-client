
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import AuthNav from "../shared/AuthNav";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-surface) backdrop-blur-md">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">

        {/* Brand logo */}
        <Logo />

        {/* Desktop navigation */}
        <NavLinks />

        {/* Navigation actions */}
        <div className="flex shrink-0 items-center gap-3">

          {/* Light / Dark mode */}
          <ThemeToggle />

          {/* Login, Register and Profile Dropdown */}
          <AuthNav />

          {/* Mobile navigation */}
          <MobileMenu />

        </div>
      </div>
    </header>
  );
}
