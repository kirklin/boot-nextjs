import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

// Define locales and default locale directly
export const locales = ["en", "zh"] as const;
export const defaultLocale = "en";
export const localePrefix = "as-needed"; // Or 'always' or 'never'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // The locale prefixing strategy
  localePrefix,
});

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
