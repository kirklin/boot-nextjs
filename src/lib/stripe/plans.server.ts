import type { SubscriptionPlan } from "./plans";
import { env } from "~/config/server";
import { subscriptionPlans } from "./plans";

/**
 * Maps plan names to Stripe price IDs from the environment, so the template
 * never ships account-specific price IDs in source. Create the prices in your
 * Stripe Dashboard (Product catalog) and set the STRIPE_PRICE_* variables.
 *
 * The optional annual price enables the plugin's `annual: true` upgrade flag
 * (monthly <-> yearly switching through the Stripe Billing Portal).
 */
const planPriceIds: Record<string, { priceId?: string; annualDiscountPriceId?: string }> = {
  Supporter: {
    priceId: env.STRIPE_PRICE_SUPPORTER,
    annualDiscountPriceId: env.STRIPE_PRICE_SUPPORTER_ANNUAL,
  },
  Professional: {
    priceId: env.STRIPE_PRICE_PROFESSIONAL,
    annualDiscountPriceId: env.STRIPE_PRICE_PROFESSIONAL_ANNUAL,
  },
  Partner: {
    priceId: env.STRIPE_PRICE_PARTNER,
    annualDiscountPriceId: env.STRIPE_PRICE_PARTNER_ANNUAL,
  },
};

export interface StripePlanConfig {
  name: string;
  priceId: string;
  annualDiscountPriceId?: string;
  limits: SubscriptionPlan["limits"];
  freeTrial?: { days: number };
}

/**
 * Plans passed to the better-auth Stripe plugin. Plans without a configured
 * price ID are skipped, so the app still boots (and the pricing page still
 * renders) before Stripe is fully set up.
 */
export function getStripePlans(): StripePlanConfig[] {
  return subscriptionPlans.flatMap((plan) => {
    const prices = planPriceIds[plan.name];
    if (!prices?.priceId) {
      return [];
    }
    return [{
      name: plan.name,
      priceId: prices.priceId,
      ...(prices.annualDiscountPriceId && { annualDiscountPriceId: prices.annualDiscountPriceId }),
      limits: plan.limits,
      ...(plan.freeTrialDays && { freeTrial: { days: plan.freeTrialDays } }),
    }];
  });
}
