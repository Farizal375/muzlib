import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Untuk avatar user dari Clerk
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;