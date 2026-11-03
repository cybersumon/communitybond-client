
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

/**
 * EventModalClose
 *
 * PURPOSE:
 * Close event details and return users
 * to the page they opened the event from.
 *
 * SECURITY:
 * Allow only known internal return paths.
 * Do not allow external redirect URLs.
 */
export default function EventModalClose() {
  const searchParams = useSearchParams();

  const requestedPath = searchParams.get("returnTo");

  // Only allow these internal application routes.
  const allowedPaths = [
    "/",
    "/upcoming-events",
    "/my-events",
  ];

  const closePath =
    requestedPath &&
    allowedPaths.includes(requestedPath)
      ? requestedPath
      : "/upcoming-events";

  return (
    <Link
      href={closePath}
      scroll={false}
      aria-label="Close event details"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-slate-100"
    >
      <X size={20} aria-hidden="true" />
    </Link>
  );
}
