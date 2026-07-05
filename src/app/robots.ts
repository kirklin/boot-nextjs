import type { MetadataRoute } from "next";
import { getBaseUrl } from "~/lib/url";

// Pages with no SEO value, kept out of the index (paired with noindex
// metadata on the routes themselves). The "/*/" variants cover
// locale-prefixed URLs (/zh/dashboard, ...).
const privatePages = ["/dashboard", "/sign-in", "/sign-up", "/payment-result"];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl(); // Define base URL

  // sitemap.ts covers every locale (with hreflang alternates) in one file.
  const sitemaps: string[] = [`${baseUrl}/sitemap.xml`];

  const commonDisallow = [
    "/api/",
    "/static/",
    "/404",
    "/500",
    "/*.json$",
    "/cdn-cgi/",
    ...privatePages.flatMap(page => [page, `/*${page}`]),
  ];

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
