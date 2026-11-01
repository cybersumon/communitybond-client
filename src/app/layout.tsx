import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";

/**
 * SEO metadata for the website.
 * Next.js uses this information in the browser and search results.
 */
export const metadata: Metadata = {
  title: "CommunityBond | Together for Good",
  description:
    "Discover, create and join community service events that make a positive difference.",
};

/**
 * RootLayout
 *
 * WHY:
 * Shared layout for every route in the application.
 *
 * HOW:
 * Navbar renders once as part of the shared structure.
 * The children prop represents the current page content.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
        <Navbar />

        {/* Render the currently active page. */}
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}