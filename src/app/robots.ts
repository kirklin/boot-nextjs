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

  const commonDisallow = ["/api/", "/static/", "/404", "/500", "/*.json$", "/cdn-cgi/"];

  const aiBotUserAgents = [
    "AI2Bot",
    "Amazonbot",
    "amazon-kendra",
    "anthropic-ai",
    "Applebot",
    "Applebot-Extended",
    "AwarioRssBot",
    "AwarioSmartBot",
    "Brightbot",
    "Bytespider",
    "ChatGPT-User",
    "ClaudeBot",
    "Diffbot",
    "DuckAssistBot",
    "FacebookBot",
    "FriendlyCrawler",
    "Google-Extended",
    "GPTBot",
    "iaskspider/2.0",
    "ICC-Crawler",
    "img2dataset",
    "Kangaroo Bot",
    "LinerBot",
    "MachineLearningForPeaceBot",
    "Meltwater",
    "meta-externalagent",
    "meta-externalfetcher",
    "Nicecrawler",
    "OAI-SearchBot",
    "omgili",
    "omgilibot",
    "PanguBot",
    "PerplexityBot",
    "Perplexity-User",
    "PetalBot",
    "PiplBot",
    "QualifiedBot",
    "Scoop.it",
    "Seekr",
    "SemrushBot-OCOB",
    "Sidetrade indexer bot",
    "Timpibot",
    "VelenPublicWebCrawler",
    "Webzio-Extended",
    "YouBot",
  ];

  return {
    rules: [
      // Googlebot can crawl everything allowed by default rules
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: commonDisallow,
      },
      // Explicitly allow specified AI crawlers with general rules
      {
        userAgent: aiBotUserAgents,
        allow: "/",
        disallow: commonDisallow,
      },
      // Default rules for all other crawlers (catch-all)
      {
        userAgent: "*",
        allow: "/",
        disallow: commonDisallow,
      },
    ],
    sitemap: sitemaps,
  };
}
