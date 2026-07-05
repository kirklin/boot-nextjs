#!/usr/bin/env node
/**
 * One-shot Stripe seeding for local/test setup.
 *
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-seed.mjs
 *
 * Creates the products + monthly/annual prices for the plans in
 * src/lib/stripe/plans.ts and prints the STRIPE_PRICE_* lines to paste into
 * .env. Idempotent: re-running reuses existing prices by lookup_key instead of
 * creating duplicates. Test-mode only guard included.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Stripe from "stripe";

// Read STRIPE_SECRET_KEY from the shell env, falling back to .env so you can
// run this right after filling it in (no need to export it).
const ENV_KEY_PATTERN = /^STRIPE_SECRET_KEY=(.*)$/m;
const QUOTE_PATTERN = /^["']|["']$/g;

function keyFromEnvFile() {
  const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".env");
  if (!fs.existsSync(envPath)) {
    return undefined;
  }
  const match = fs.readFileSync(envPath, "utf8").match(ENV_KEY_PATTERN);
  return match ? match[1].trim().replace(QUOTE_PATTERN, "") : undefined;
}

const key = process.env.STRIPE_SECRET_KEY || keyFromEnvFile();
if (!key) {
  console.error("Set STRIPE_SECRET_KEY first, e.g.:\n  STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-seed.mjs");
  process.exit(1);
}
if (!key.startsWith("sk_test_")) {
  console.error("Refusing to run: this seeds demo products and is meant for a TEST key (sk_test_...).");
  process.exit(1);
}

const stripe = new Stripe(key);

// Mirrors src/lib/stripe/plans.ts. Annual = 10x monthly (≈2 months free).
const plans = [
  { key: "SUPPORTER", name: "Supporter", monthly: 900 },
  { key: "PROFESSIONAL", name: "Professional", monthly: 2900 },
  { key: "PARTNER", name: "Partner", monthly: 9900 },
];
const currency = "usd";

async function findPrice(lookupKey) {
  const existing = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  return existing.data[0] ?? null;
}

async function findOrCreatePrice(lookupKey, params) {
  const found = await findPrice(lookupKey);
  if (found) {
    return { id: found.id, reused: true };
  }
  const price = await stripe.prices.create({ ...params, lookup_key: lookupKey });
  return { id: price.id, reused: false };
}

/**
 * Enables "switch plans" in the Billing Portal so an active subscriber can
 * change plans. Without this, @better-auth/stripe's plan-change flow (which
 * uses the portal's subscription_update) fails with "the subscription update
 * feature in the portal configuration is disabled".
 */
async function configurePortal(portalProducts) {
  const existing = await stripe.billingPortal.configurations.list({ is_default: true, limit: 1 });
  const features = {
    subscription_update: {
      enabled: true,
      default_allowed_updates: ["price"],
      // Upgrades charge the prorated difference immediately and produce an
      // invoice right away (the industry-standard SaaS behavior). In-app
      // downgrades bypass this entirely: they are scheduled at period end.
      proration_behavior: "always_invoice",
      products: portalProducts,
    },
    subscription_cancel: { enabled: true },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
  };

  if (existing.data.length > 0) {
    await stripe.billingPortal.configurations.update(existing.data[0].id, { features });
    console.log("  Billing Portal: updated default config (plan switching enabled)");
  } else {
    await stripe.billingPortal.configurations.create({
      business_profile: { headline: "boot-nextjs" },
      features,
    });
    console.log("  Billing Portal: created default config (plan switching enabled)");
  }
}

async function main() {
  const envLines = [];
  const portalProducts = [];

  for (const plan of plans) {
    const slug = plan.key.toLowerCase();
    const monthlyKey = `boot_${slug}_monthly`;
    const annualKey = `boot_${slug}_annual`;

    // Derive the product from an existing price so re-runs never create
    // duplicate products (products.create is not idempotent).
    const existingMonthly = await findPrice(monthlyKey);
    let productId = existingMonthly?.product;
    if (!productId) {
      const product = await stripe.products.create({
        name: `boot-nextjs ${plan.name}`,
        metadata: { boot_nextjs_plan: slug },
      });
      productId = product.id;
    }

    const monthly = await findOrCreatePrice(monthlyKey, {
      product: productId,
      currency,
      unit_amount: plan.monthly,
      recurring: { interval: "month" },
    });
    const annual = await findOrCreatePrice(annualKey, {
      product: productId,
      currency,
      unit_amount: plan.monthly * 10,
      recurring: { interval: "year" },
    });

    console.log(`  ${plan.name}: ${monthly.reused ? "reused" : "created"} monthly, ${annual.reused ? "reused" : "created"} annual`);
    envLines.push(`STRIPE_PRICE_${plan.key}=${monthly.id}`);
    envLines.push(`STRIPE_PRICE_${plan.key}_ANNUAL=${annual.id}`);
    portalProducts.push({ product: productId, prices: [monthly.id, annual.id] });
  }

  await configurePortal(portalProducts);

  console.log("\nPaste these into your .env:\n");
  console.log(envLines.join("\n"));
  console.log("");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
