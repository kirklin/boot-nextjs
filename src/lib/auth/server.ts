import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { stripe } from "@better-auth/stripe";
import { logger } from "@kirklin/logger";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession, jwt } from "better-auth/plugins";
import { env } from "~/config/server";
import { db } from "~/lib/db";
import { account, jwks, session, subscription, user, verification } from "~/lib/db/schema";
import { getStripePlans } from "~/lib/stripe/plans.server";
import { stripe as stripeClient } from "~/lib/stripe/server";
import { handleStripeEvent } from "~/lib/stripe/webhook";
import { getBaseUrl } from "~/lib/url";

function createAuth() {
  if (!db) {
    return null;
  }

  // 配置社交登录提供商
  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

  // 只有在环境变量存在时才添加 GitHub 提供商
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }

  // 只有在环境变量存在时才添加 Google 提供商
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  const basePlugins: BetterAuthPlugin[] = [jwt()];

  if (stripeClient && env.STRIPE_WEBHOOK_SECRET) {
    const plans = getStripePlans();
    if (plans.length === 0) {
      logger.warn("[stripe] No subscription plans configured — set the STRIPE_PRICE_* environment variables to enable checkout.");
    }
    basePlugins.push(
      stripe({
        stripeClient,
        stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
        createCustomerOnSignUp: true,
        // Handles events outside the plugin's scope (one-time payments, ...).
        onEvent: handleStripeEvent,
        subscription: {
          enabled: true,
          plans,
          // The plugin never restricts payment_method_types, so every payment
          // method enabled in the Stripe Dashboard is offered automatically.
          // Extra Checkout Session params can be added here.
          getCheckoutSessionParams: () => ({
            params: {
              allow_promotion_codes: true,
              billing_address_collection: "auto",
            },
          }),
        },
      }),
    );
  } else if (stripeClient || env.STRIPE_WEBHOOK_SECRET) {
    logger.warn("[stripe] Partial Stripe configuration — set both STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to enable billing. Stripe features are disabled.");
  }

  const authOptions = {
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user,
        session,
        account,
        verification,
        jwks,
        subscription,
      },
    }),
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: getBaseUrl(),
    socialProviders,
    plugins: basePlugins,
  } satisfies BetterAuthOptions;

  return betterAuth({
    ...authOptions,
    plugins: [
      ...basePlugins,
      // The Stripe plugin populates user.stripeCustomerId at runtime; this
      // surfaces it in the inferred session type for API routes.
      customSession(async ({ session, user: authUser }) => {
        return {
          session,
          user: authUser as typeof authUser & { stripeCustomerId?: string | null },
        };
      }, authOptions),
      // Must stay last so cookies set by earlier plugins' hooks reach Next.js.
      nextCookies(),
    ],
  });
}

export const auth = createAuth();
