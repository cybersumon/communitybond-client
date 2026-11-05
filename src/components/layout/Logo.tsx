
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="CommunityBond Home"
      className="relative inline-block w-48 shrink-0 sm:w-52 lg:w-56"
    >
      {/* Brand Logo */}
      <Image
  key="communitybond-logo-v2"
  src="/images/communitybond-logo.png?v=2"
  alt="CommunityBond"
  width={300}
  height={100}
  priority
  unoptimized
  className="block h-auto w-full object-contain"
/>

      {/* Tagline under the wordmark */}
      <span className="absolute top-[65%] right-[6%] left-[18%] block text-center text-[9px] font-bold uppercase tracking-[0.12em] whitespace-nowrap text-(--color-primary) sm:text-[10px]">
        Together We Care
      </span>
    </Link>
  );
}

