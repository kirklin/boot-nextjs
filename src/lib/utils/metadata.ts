import { defaultLocale, localePrefix, routing } from "~/lib/i18n/navigation";

interface AlternatesConfig {
  canonical: string;
  languages: Record<string, string>;
}

export function createAlternates(basePath: string): AlternatesConfig {
  const languages: Record<string, string> = {};

  // Generate language-specific URLs
  routing.locales.forEach((locale: string) => {
    // For default locale with localePrefix="as-needed", omit the locale prefix
    if (locale === defaultLocale && localePrefix === "as-needed") {
      languages[locale] = basePath;
    } else {
      // For non-default locales or if localePrefix="always"
      if (basePath === "/") {
        languages[locale] = `/${locale}`;
      } else {
        languages[locale] = `/${locale}${basePath}`;
      }
    }
  });

  // Add x-default (should point to the default language)
  // For localePrefix="as-needed", x-default points to URL without locale prefix
  if (localePrefix === "as-needed") {
    languages["x-default"] = basePath;
  } else {
    // For localePrefix="always" or other settings
    if (basePath === "/") {
      languages["x-default"] = `/${defaultLocale}`;
    } else {
      languages["x-default"] = `/${defaultLocale}${basePath}`;
    }
  }

  return {
    canonical: basePath,
    languages,
  };
}
