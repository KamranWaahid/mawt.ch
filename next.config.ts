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
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      // Localized shortcut redirects.
      {
        source: "/en/integrations",
        destination: "/en/services/ai-solutions/integrations-apis",
        permanent: true,
      },
      {
        source: "/fr/integrations",
        destination: "/fr/services/solutions-ia/integrations-apis",
        permanent: true,
      },
      // FR pages now use localized slugs. 301 the old English-slug URLs to the
      // canonical localized URL to avoid duplicate content.
      { source: "/fr/about", destination: "/fr/a-propos", permanent: true },
      { source: "/fr/projects", destination: "/fr/projets", permanent: true },
      { source: "/fr/projects/:slug*", destination: "/fr/projets/:slug*", permanent: true },
      { source: "/fr/our-process", destination: "/fr/notre-methode", permanent: true },
      { source: "/fr/security", destination: "/fr/securite", permanent: true },
      { source: "/fr/partners", destination: "/fr/clients", permanent: true },
      { source: "/fr/terms", destination: "/fr/conditions-generales", permanent: true },
      // The /legal folder serves the privacy policy; expose it under the
      // privacy-named localized URLs and retire the misleading /legal path.
      { source: "/fr/legal", destination: "/fr/confidentialite", permanent: true },
      { source: "/en/legal", destination: "/en/privacy", permanent: true },
      { source: "/fr/legal-notice", destination: "/fr/mentions-legales", permanent: true },
      // Geneva hub: on-disk folder is `geneve`; the canonical EN URL is `geneva`.
      // 301 the folder-name variant to avoid duplicate content.
      { source: "/en/geneve", destination: "/en/geneva", permanent: true },
    ];
  },
};

export default nextConfig;
