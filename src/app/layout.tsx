import "./globals.css";
import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import ThemeProvider from "@/providers/ThemeProvider";

import Footer from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "CommunityBond | Together for Good",
  description:
    "Discover, create and join community service events.",
};
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
          <Navbar />
          {children}
          {modal}
        </ThemeProvider>
         <Footer />
      </body>
    </html>
  );
}
