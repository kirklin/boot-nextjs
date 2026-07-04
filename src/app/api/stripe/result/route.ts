import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "~/lib/auth/server";
import { stripe } from "~/lib/stripe/server";

// Returns the outcome of a Checkout Session for the payment-result page.
// Amounts and dates are returned raw so the client can format them for the
// active locale. Only the session's owner can read it.

export async function GET(req: Request) {
  if (!auth) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing or invalid session_id parameter" }, { status: 400 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.latest_charge", "invoice"],
    });

    // Ownership: sessions created by this app carry server-set userId metadata
    // (both the one-time checkout route and the better-auth plugin set it);
    // fall back to the Stripe customer linked to the current user. Don't trust
    // client_reference_id — it is payer-controlled on Payment Links.
    const customerId = typeof checkoutSession.customer === "string"
      ? checkoutSession.customer
      : checkoutSession.customer?.id;
    const isOwner = checkoutSession.metadata?.userId === session.user.id
      || (!!session.user.stripeCustomerId && customerId === session.user.stripeCustomerId);
    if (!isOwner) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // In "payment" mode the charge (and receipt) hangs off the payment intent;
    // in "subscription" mode the payment lands on the invoice instead.
    const paymentIntent = typeof checkoutSession.payment_intent === "string" ? null : checkoutSession.payment_intent;
    const charge = paymentIntent?.latest_charge && typeof paymentIntent.latest_charge !== "string"
      ? paymentIntent.latest_charge
      : null;
    const invoice = typeof checkoutSession.invoice === "string" ? null : checkoutSession.invoice;
    const receiptUrl = charge?.receipt_url ?? invoice?.hosted_invoice_url ?? null;

    return NextResponse.json({
      status: checkoutSession.status,
      paymentStatus: checkoutSession.payment_status,
      mode: checkoutSession.mode,
      amountTotal: checkoutSession.amount_total,
      currency: checkoutSession.currency,
      createdAt: new Date(checkoutSession.created * 1000).toISOString(),
      customerEmail: checkoutSession.customer_details?.email ?? null,
      paymentMethod: charge?.payment_method_details?.type ?? null,
      receiptUrl,
    });
  } catch (err) {
    console.error("Error retrieving payment result:", err);
    if (err instanceof Stripe.errors.StripeError && err.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to retrieve payment information" }, { status: 500 });
  }
}
