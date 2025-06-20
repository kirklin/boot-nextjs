import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession, jwt } from "better-auth/plugins";
import { env } from "~/config/server";
import { db } from "~/lib/db";
import { account, jwks, session, subscription, user, verification } from "~/lib/db/schema";
import { subscriptionPlans } from "~/lib/stripe/plans";
import { stripe as stripeClient } from "~/lib/stripe/server";

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

const basePlugins: BetterAuthPlugin[] = [nextCookies(), jwt()];

if (stripeClient && env.STRIPE_WEBHOOK_SECRET) {
  basePlugins.push(
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: subscriptionPlans,
      },
    }),
  );
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
  socialProviders,
  plugins: basePlugins,
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...authOptions,
  plugins: [
    ...basePlugins,
    customSession(async ({ session, user: authUser }: any) => {
      if (!authUser) {
        return session;
      }
      return {
        ...session,
        user: {
          ...authUser,
          stripeCustomerId: authUser.stripeCustomerId,
        },
      };
    }, authOptions),
  ],
});
