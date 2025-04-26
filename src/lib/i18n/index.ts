import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./navigation";

// Using internationalization in Server Components
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Load the serialized messages for the given locale.
    messages: (await import(`../../locales/${locale}.json`)).default,
  };
});
