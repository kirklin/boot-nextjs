import withNextIntl from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // Security headers
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
  // Optimize heavy package imports for faster dev & smaller bundles
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

// Wrap the config with the next-intl plugin
// Make sure the path to your i18n config file is correct
export default withNextIntl("./src/lib/i18n/index.ts")(nextConfig);
