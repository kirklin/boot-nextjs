import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { routing } from "./lib/i18n/navigation";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
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
