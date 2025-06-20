import { stripeClient } from "@better-auth/stripe/client";
import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
