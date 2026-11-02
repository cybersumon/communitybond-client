
import type { NextConfig } from "next";

/**
 * Next.js Configuration
 *
 * Allow optimized external images from Unsplash.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
