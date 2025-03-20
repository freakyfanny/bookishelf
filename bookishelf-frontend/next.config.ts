import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    domains: ['covers.openlibrary.org'],
  },
};

export default nextConfig;
