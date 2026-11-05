
import Link from "next/link";
export const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/upcoming-events" },
];

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
