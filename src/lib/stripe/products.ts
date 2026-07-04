import { env } from "~/config/server";

/**
 * Server-side catalog of one-time purchase products (Checkout `mode: "payment"`).
 *
 * One-time Checkout supports the full range of Dashboard-enabled payment
 * methods (cards, wallets, Alipay, WeChat Pay, bank transfers, ...) — several
 * of which don't support recurring subscriptions. Clients reference products
 * by `key` only; price IDs stay on the server.
 */
export interface OneTimeProduct {
  key: string;
  priceId?: string;
}

const oneTimeProducts: OneTimeProduct[] = [
  {
    key: "lifetime",
    priceId: env.STRIPE_PRICE_LIFETIME,
  },
];

export function getOneTimeProduct(key: string): OneTimeProduct | undefined {
  return oneTimeProducts.find(product => product.key === key);
}
