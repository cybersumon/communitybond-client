
import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import ThemeProvider from "@/providers/ThemeProvider";

import "./globals.css";

/**
 * Global website metadata.
 */
export const metadata: Metadata = {
  title: "CommunityBond | Together for Good",
  description:
    "Discover, create and join community service events.",
};

/**
 * RootLayout
 *
 * PURPOSE:
 * Provide global navigation, themes and modal routing.
 *
 * children:
 * The current main page content.
 *
 * modal:
 * The intercepted event details popup.
 *
 * HOW:
 * Next.js injects the @modal parallel route
 * into the modal prop.
 */
export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>

          {/* Shared website navigation. */}
          <Navbar />

          {/* Main route content. */}
          {children}

          {/* Popup content from the @modal slot. */}
          {modal}

        </ThemeProvider>
      </body>
    </html>
  );
}
