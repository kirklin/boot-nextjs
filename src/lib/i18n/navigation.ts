import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["en", "zh"] as const;
export const defaultLocale = "en";

/**
 * Locale routing strategy — switch it here, everything else adapts
 * (navigation, middleware redirects, canonical/hreflang metadata, sitemap):
 *
 * - "never" (default): one clean URL for every locale; the language comes
 *   from the NEXT_LOCALE cookie / Accept-Language. The right choice for
 *   app-first products (dashboard, payments) — but search engines can then
 *   only index ONE language version of the public pages (no hreflang).
 * - "as-needed": default locale unprefixed (/pricing), others prefixed
 *   (/zh/pricing). Switch to this when multilingual SEO for the marketing
 *   pages matters — hreflang/sitemap alternates light up automatically.
 * - "always": every locale prefixed (/en/pricing, /zh/pricing).
 *
 * For domain-based locales (example.com -> en, example.cn -> zh), uncomment
 * `domains` below and pass it to defineRouting. Note: absolute URLs in
 * sitemap/metadata derive from getBaseUrl(), which assumes a single domain —
 * adapt src/lib/utils/metadata.ts and src/app/sitemap.ts to emit per-domain
 * origins if you enable this.
 * https://next-intl.dev/docs/routing/configuration#domains
 */
export const localePrefix: "always" | "as-needed" | "never" = "never";

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
