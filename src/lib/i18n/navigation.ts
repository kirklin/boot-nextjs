import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["en", "zh"] as const;
export const defaultLocale = "en";

/**
 * Locale routing strategy — switch it here, everything else adapts
 * (navigation, middleware redirects, canonical/hreflang metadata, sitemap):
 *
 * - "as-needed": default locale unprefixed (/pricing), others prefixed
 *   (/zh/pricing). The common choice for marketing + app hybrids.
 * - "always": every locale prefixed (/en/pricing, /zh/pricing).
 * - "never": one URL for all locales; the locale comes from the NEXT_LOCALE
 *   cookie / Accept-Language. Simplest for login-only apps, but search
 *   engines can then only index ONE language version (no hreflang).
 *
 * For domain-based locales (example.com -> en, example.cn -> zh), uncomment
 * `domains` below and pass it to defineRouting. Note: absolute URLs in
 * sitemap/metadata derive from getBaseUrl(), which assumes a single domain —
 * adapt src/lib/utils/metadata.ts and src/app/sitemap.ts to emit per-domain
 * origins if you enable this.
 * https://next-intl.dev/docs/routing/configuration#domains
 */
export const localePrefix: "always" | "as-needed" | "never" = "as-needed";

// export const domains = [
//   { domain: "example.com", defaultLocale: "en" },
//   { domain: "example.cn", defaultLocale: "zh" },
// ] as const;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // The locale prefixing strategy
  localePrefix,

  // domains,
});

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
