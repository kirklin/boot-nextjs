/**
 * Subscription plan display metadata, safe to import from client components.
 * Copy (description/features) lives in the locale files under `Pricing.plans.<key>`.
 * Stripe price IDs are server-only and attached in ./plans.server.ts.
 */
export interface SubscriptionPlan {
  /** Stable identifier used for translation keys. */
  key: string;
  /** Plan name registered with the better-auth Stripe plugin (matched case-insensitively). */
  name: string;
  /** Display price in the smallest currency unit (e.g. cents). */
  price: number;
  /** Display price for annual billing (total per year). Mirrors STRIPE_PRICE_*_ANNUAL. */
  annualPrice: number;
  /** ISO currency code for the display price. */
  currency: string;
  buttonVariant: "default" | "outline";
  popular: boolean;
  freeTrialDays?: number;
  limits: {
    projects: number;
  };
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    key: "supporter",
    name: "Supporter",
    price: 900,
    annualPrice: 9000, // 10x monthly = 2 months free
    currency: "usd",
    buttonVariant: "outline",
    popular: false,
    limits: {
      projects: 1,
    },
  },
  {
    key: "professional",
    name: "Professional",
    price: 2900,
    annualPrice: 29000,
    currency: "usd",
    buttonVariant: "default",
    popular: true,
    freeTrialDays: 14,
    limits: {
      projects: 5,
    },
  },
  {
    key: "partner",
    name: "Partner",
    price: 9900,
    annualPrice: 99000,
    currency: "usd",
    buttonVariant: "outline",
    popular: false,
    limits: {
      projects: -1, // -1 means unlimited
    },
  },
];

/**
 * The better-auth Stripe plugin stores plan names lowercased, so lookups
 * must always be case-insensitive.
 */
export function findPlanByName(name: string | null | undefined): SubscriptionPlan | undefined {
  if (!name) {
    return undefined;
  }
  return subscriptionPlans.find(plan => plan.name.toLowerCase() === name.toLowerCase());
}

export function isSamePlan(a: string | null | undefined, b: string | null | undefined): boolean {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}
