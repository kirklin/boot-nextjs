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
  /** Name of the lower tier whose features are included ("Everything in X, plus:"). */
  includes?: string;
  /**
   * One icon per entry of the locale `Pricing.plans.<key>.features` array
   * (see FEATURE_ICONS in pricing.tsx; falls back to a check mark).
   */
  featureIcons: string[];
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
    featureIcons: ["sparkles", "messages", "badge", "users"],
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
    includes: "Supporter",
    featureIcons: ["headphones", "rocket", "folders"],
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
    includes: "Professional",
    featureIcons: ["message-dot", "building", "sliders", "infinity"],
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

/**
 * Which plan to visually promote, relative to what the user already has:
 * not subscribed -> the marketing "popular" plan; subscribed -> the next tier
 * up; already on the top tier -> nothing (never promote a downgrade).
 */
export function getHighlightedPlan(currentPlanName: string | null | undefined): SubscriptionPlan | null {
  const current = findPlanByName(currentPlanName);
  if (!current) {
    return subscriptionPlans.find(plan => plan.popular) ?? null;
  }
  const upgrades = subscriptionPlans
    .filter(plan => plan.price > current.price)
    .sort((a, b) => a.price - b.price);
  return upgrades[0] ?? null;
}
