import type { MetadataRoute } from "next";
import { locales } from "~/lib/i18n/navigation";
import { getBaseUrl } from "~/lib/url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl(); // Define base URL

  // Initialize sitemap array with main sitemap
  const sitemaps: string[] = [`${baseUrl}/sitemap.xml`];

  // Add language-specific sitemaps
  locales.forEach((locale) => {
    if (locale !== "en") { // Skip default locale as it's already covered
      sitemaps.push(`${baseUrl}/${locale}/sitemap.xml`);
    }
  });

  return {
    rules: [
      // Default rules for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/", "/404", "/500", "/*.json$", "/cdn-cgi/"],
      },
      // Specific rules for GPTBot
      {
        userAgent: "GPTBot",
        allow: "/llms.txt", // Allow access only to llms.txt
        disallow: ["/api/", "/_next/", "/static/", "/404", "/500", "/*.json$", "/cdn-cgi/"], // Disallow everything else
      },
      // Specific rules for Anthropic AI
      {
        userAgent: "anthropic-ai",
        allow: "/llms.txt", // Allow access only to llms.txt
        disallow: ["/api/", "/_next/", "/static/", "/404", "/500", "/*.json$", "/cdn-cgi/"], // Disallow everything else
      },
      // Googlebot can crawl everything allowed by default rules
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/", "/404", "/500", "/*.json$", "/cdn-cgi/"],
      },
    ],
    sitemap: sitemaps,
  };
}
