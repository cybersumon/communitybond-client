
import Link from "next/link";

/**
 * Navigation link configuration.
 *
 * WHY:
 * Store navigation URLs in one reusable place.
 * We can use these same links in desktop and mobile menus.
 */
export const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
];

/**
 * NavLinks Component
 *
 * PURPOSE:
 * Display desktop navigation links.
 *
 * HOW:
 * Array.map() converts each navigation item into a Link.
 *
 * REACT CONCEPT:
 * "key" helps React identify list items efficiently.
 */
export default function NavLinks() {
  return (
    <div className="hidden items-center gap-8 md:flex">
      {navigationLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-semibold text-(--color-foreground) transition-colors hover:text-[#176B50]"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
