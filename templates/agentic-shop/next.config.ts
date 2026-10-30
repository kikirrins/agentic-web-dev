import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      // Product images from real stores and from mock.shop (it serves them from cdn.shopify.com too).
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "mock.shop" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
