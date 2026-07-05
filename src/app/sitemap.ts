import type { MetadataRoute } from "next";
import { localePrefix, routing } from "~/lib/i18n/navigation";
import { getBaseUrl } from "~/lib/url";
import { localizedPathname } from "~/lib/utils/metadata";

// Indexable public routes. Auth, dashboard, and payment pages are
// intentionally excluded (they are noindex + disallowed in robots.ts).
const publicRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/showcase", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-use", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  return publicRoutes.flatMap(({ path, changeFrequency, priority }) => {
    // With localePrefix "never" every locale shares one URL — a single entry,
    // no hreflang alternates.
    if (localePrefix === "never") {
      return [{
        url: `${baseUrl}${localizedPathname(path, routing.defaultLocale)}`,
        lastModified,
        changeFrequency,
        priority,
      }];
    }

    // One entry per language version, each carrying the full hreflang set.
    const languages = Object.fromEntries(
      routing.locales.map(locale => [locale, `${baseUrl}${localizedPathname(path, locale)}`]),
    );

    return routing.locales.map(locale => ({
      url: `${baseUrl}${localizedPathname(path, locale)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
