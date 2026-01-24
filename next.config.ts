import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify configuration
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
