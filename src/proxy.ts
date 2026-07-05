import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createIntlMiddleware from "next-intl/middleware";

import { NextResponse } from "next/server";
import { routing } from "./lib/i18n/navigation";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Keep the user's locale prefix when redirecting (e.g. /zh/dashboard -> /zh/sign-in).
  const localePrefix = routing.locales.find(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  const withLocale = (path: string) => (localePrefix ? `/${localePrefix}${path}` : path);

  const authPages = ["/sign-in", "/sign-up"];
  const isAuthPage = authPages.some(page => pathname.endsWith(page));

  // Optimistic, cookie-presence-only checks for fast UX. Real authorization
  // happens in API routes / server code via auth.api.getSession.
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL(withLocale("/dashboard"), request.url));
  }

  if (!sessionCookie && pathname.includes("/dashboard")) {
    return NextResponse.redirect(new URL(withLocale("/sign-in"), request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
