import type Stripe from "stripe";
import { logger } from "@kirklin/logger";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "~/lib/db";
import { payment } from "~/lib/db/schema";

/**
 * Handles Stripe webhook events that the better-auth Stripe plugin doesn't
 * cover. The plugin verifies the signature, syncs the `subscription` table,
 * and then forwards every event here via its `onEvent` option.
 *
 * This template records one-time purchases (Checkout `mode: "payment"`),
 * including async payment methods (bank transfers, konbini, ...) that
 * complete or fail after the checkout session ends.
 *
 * Note: for mode "payment" sessions the plugin's own checkout.session.completed
 * handler logs a benign "Stripe webhook failed" error (it expects a
 * subscription on the session). The event still reaches this handler and the
 * webhook still returns 200 — the log line can be ignored.
 */
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        if (session.mode === "payment") {
          await upsertOneTimePayment(session);
        }
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        if (session.mode === "payment") {
          await upsertOneTimePayment(session, "failed");
        }
        break;
      }
      default:
        // Extend here for refunds (charge.refunded), disputes, invoice events, ...
        break;
    }
  } catch (error) {
    // Don't rethrow: a failing side effect here shouldn't turn the webhook
    // into a 500 and put Stripe into endless redelivery.
    logger.error(`[stripe] Failed to handle webhook event ${event.type} (${event.id}):`, error);
  }
}

async function upsertOneTimePayment(
  session: Stripe.Checkout.Session,
  statusOverride?: string,
): Promise<void> {
  if (!db) {
    logger.warn("[stripe] Received a payment webhook but the database is not configured.");
    return;
  }

  // Only trust metadata.userId — it is set server-side by our checkout route.
  // (client_reference_id can be attacker-supplied on Payment Links.)
  const userId = session.metadata?.userId;
  if (!userId) {
    // Not created by this app (e.g. a Payment Link) — extend upsertOneTimePayment if you need those.
    logger.warn(`[stripe] Checkout session ${session.id} has no userId metadata; skipping.`);
    return;
  }

  const status = statusOverride ?? session.payment_status;
  const values = {
    stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
    productKey: session.metadata?.productKey ?? null,
    amountTotal: session.amount_total,
    currency: session.currency,
    status,
    updatedAt: new Date(),
  };

  await db
    .insert(payment)
    .values({
      id: nanoid(),
      userId,
      stripeCheckoutSessionId: session.id,
      ...values,
    })
    .onConflictDoUpdate({
      target: payment.stripeCheckoutSessionId,
      set: {
        ...values,
        // Webhook delivery is at-least-once and unordered: never let a stale
        // "unpaid" snapshot overwrite a terminal status.
        status: sql`CASE WHEN ${payment.status} IN ('paid', 'failed', 'refunded') AND ${status} = 'unpaid' THEN ${payment.status} ELSE ${status} END`,
      },
    });
}
