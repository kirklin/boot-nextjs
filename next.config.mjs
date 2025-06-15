import withNextIntl from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js configuration options go here
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

// Wrap the config with the next-intl plugin
// Make sure the path to your i18n config file is correct
export default withNextIntl("./src/lib/i18n/index.ts")(nextConfig);
