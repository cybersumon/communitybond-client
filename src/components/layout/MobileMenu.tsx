
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationLinks } from "./NavLinks";
import AuthNav from "../shared/AuthNav";

export default function MobileMenu() {
  // Controls whether the mobile menu is visible.
  const [isOpen, setIsOpen] = useState(false);

  // Get current route to highlight the active page.
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      {/* Button to open or close the mobile menu. */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="rounded-xl border border-slate-200 p-2.5 text-[#176B50]"
      >
        {/* Change the icon based on menu state. */}
        <span className="text-xl leading-none" aria-hidden="true">
          {isOpen ? "✕" : "☰"}
        </span>
      </button>

      {/* Only render menu content when isOpen is true. */}
      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute left-0 top-full w-full border-t border-(--color-border) bg-(--color-surface) px-5 py-5 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={
                  pathname === item.href ? "page" : undefined
                }
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  pathname === item.href
                    ? "bg-(--color-hero) text-[#176B50]"
                    : "text-(--color-foreground) hover:bg-(--color-hero)"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <AuthNav />
          </div>
        </nav>
      )}
    </div>
  );
}
