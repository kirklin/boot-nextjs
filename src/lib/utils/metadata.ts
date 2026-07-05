import type { Metadata } from "next";
import { defaultLocale, getPathname, localePrefix, routing } from "~/lib/i18n/navigation";

type Locale = (typeof routing.locales)[number];

/**
 * Locale-prefixed pathname for a route, derived from the routing config via
 * next-intl — correct for every localePrefix strategy without hand-rolled
 * prefix logic. Combined with `metadataBase` these resolve to absolute URLs.
 */
export function localizedPathname(basePath: string, locale: Locale): string {
  return getPathname({ locale, href: basePath });
}

/**
 * Canonical + hreflang alternates for a page.
 *
 * With localePrefix "never" all locales share one URL, so only the canonical
 * is emitted — per-language alternates would all point at the same place and
 * search engines can only index a single language version.
 */
export function createAlternates(basePath: string, locale?: string): Metadata["alternates"] {
  const currentLocale = (locale ?? defaultLocale) as Locale;
  const canonical = localizedPathname(basePath, currentLocale);

  if (localePrefix === "never") {
    return { canonical };
  }

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localizedPathname(basePath, l);
  }
  // x-default: the version served when no language matches.
  languages["x-default"] = localizedPathname(basePath, defaultLocale);

  return { canonical, languages };
}

const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  zh: "zh_CN",
};

/** Open Graph locale identifier (e.g. zh -> zh_CN) for og:locale. */
export function ogLocale(locale: string): string {
  return OG_LOCALES[locale] ?? locale;
}
