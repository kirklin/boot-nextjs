import type { MetadataRoute } from "next";
import { getBaseUrl } from "~/lib/url";

export default function robots(): MetadataRoute.Robots {
  // Use the utility function to get the dynamic base URL
  const baseUrl = getBaseUrl();

  return {
    rules: [
      // Default rules: Allow access to most content, disallow specific paths
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // Disallow API routes
          "/_next/", // Disallow Next.js internal paths
          // "/static/", // Typically handled by /_next/static or root
          "/404", // Disallow error pages
          "/500", // Disallow error pages
          "/*.json$", // Disallow crawling JSON files
          "/*.xml$", // Disallow crawling XML files (except sitemap if specified below)
        ],
      },
      // Specific rules for AI crawlers needing llms.txt
      {
        userAgent: ["GPTBot", "anthropic-ai"], // Target specific AI bots
        allow: "/llms.txt", // Only allow access to llms.txt
        disallow: ["/"], // Disallow access to everything else for these specific bots
      },
      // Googlebot: Follows general rules, but explicitly listed for clarity
      // You can add more specific Googlebot rules here if needed
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          // "/static/",
          "/404",
          "/500",
          "/*.json$",
          "/*.xml$",
        ],
      },
    ],
    // Use the dynamic base URL for the sitemap location
    sitemap: `${baseUrl}/sitemap.xml`,
    // Note: Non-standard directives like LLM-Content cannot be added via MetadataRoute.
    // Ensure llms.txt and llms-full.txt exist in the /public directory.
  };
}
