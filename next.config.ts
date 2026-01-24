import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify configuration for server functions
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
