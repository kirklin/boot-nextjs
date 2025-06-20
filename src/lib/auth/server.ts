import type { BetterAuthPlugin } from "better-auth";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { env } from "~/config/server";
import { db } from "~/lib/db";
import { account, jwks, session, subscription, user, verification } from "~/lib/db/schema";
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

const plugins: BetterAuthPlugin[] = [nextCookies(), jwt()];

if (stripeClient && env.STRIPE_WEBHOOK_SECRET) {
  plugins.push(
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Supporter",
            priceId: "price_1Rc9G1PthsRl3XNksFERHQkW",
            limits: {
              projects: 1,
            },
          },
          {
            name: "Professional",
            priceId: "price_1Rc9G1PthsRl3XNkjdbbCOle",
            limits: {
              projects: 5,
            },
          },
          {
            name: "Partner",
            priceId: "price_1Rc9G1PthsRl3XNkMxgFOUmF",
            limits: {
              projects: -1, // -1 表示无限
            },
          },
        ],
      },
    }),
  );
}

export const auth = betterAuth({
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
  // 使用环境变量中的密钥
  secret: env.BETTER_AUTH_SECRET,
  // 只有在有配置的情况下才添加社交提供商
  socialProviders,
  plugins,
});
