import type { auth } from "~/lib/auth/server";
import { stripeClient } from "@better-auth/stripe/client";
import { customSessionClient, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    stripeClient({
      subscription: true,
    }),
    customSessionClient<typeof auth>(),
  ],
});
