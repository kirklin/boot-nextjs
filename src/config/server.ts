import { z } from "zod";

const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Stripe price IDs for subscription plans (see src/lib/stripe/plans.server.ts)
  STRIPE_PRICE_SUPPORTER: z.string().optional(),
  STRIPE_PRICE_SUPPORTER_ANNUAL: z.string().optional(),
  STRIPE_PRICE_PROFESSIONAL: z.string().optional(),
  STRIPE_PRICE_PROFESSIONAL_ANNUAL: z.string().optional(),
  STRIPE_PRICE_PARTNER: z.string().optional(),
  STRIPE_PRICE_PARTNER_ANNUAL: z.string().optional(),

  // Stripe price IDs for one-time purchases (see src/lib/stripe/products.ts)
  STRIPE_PRICE_LIFETIME: z.string().optional(),

  BETTER_AUTH_SECRET: z.string().optional(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
