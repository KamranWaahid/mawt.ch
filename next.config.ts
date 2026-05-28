import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:lang(en|fr)/integrations",
        destination: "/:lang/services/ai-solutions/integrations-apis",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
