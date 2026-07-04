/**
 * Currency helpers for Stripe amounts, safe for client and server use.
 * https://docs.stripe.com/currencies#zero-decimal
 * Note: ISK and UGX are special cases treated as two-decimal by Stripe.
 */
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

const THREE_DECIMAL_CURRENCIES = new Set([
  "bhd",
  "jod",
  "kwd",
  "omr",
  "tnd",
]);

/** Converts a Stripe integer amount to major currency units (e.g. 900 -> 9 USD, 900 -> 900 JPY). */
export function stripeAmountToMajorUnits(amount: number, currency: string): number {
  const code = currency.toLowerCase();
  if (ZERO_DECIMAL_CURRENCIES.has(code)) {
    return amount;
  }
  if (THREE_DECIMAL_CURRENCIES.has(code)) {
    return amount / 1000;
  }
  return amount / 100;
}

/** Formats a Stripe integer amount as a localized currency string. */
export function formatStripeAmount(amount: number, currency: string, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(stripeAmountToMajorUnits(amount, currency));
}
