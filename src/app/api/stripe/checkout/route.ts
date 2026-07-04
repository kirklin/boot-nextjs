import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { auth } from "~/lib/auth/server";
import { getOneTimeProduct } from "~/lib/stripe/products";
import { stripe } from "~/lib/stripe/server";
import { getBaseUrl } from "~/lib/url";

// Creates a Stripe Checkout Session for a one-time purchase (mode: "payment").
// Subscriptions go through the better-auth Stripe plugin instead
// (authClient.subscription.upgrade), which manages the subscription lifecycle.
//
// payment_method_types is intentionally omitted: Stripe shows every payment
// method enabled in the Dashboard (cards, wallets, Alipay, WeChat Pay, ...)
// that matches the currency and customer location.

const bodySchema = z.object({
  productKey: z.string().min(1),
  quantity: z.number().int().min(1).max(100).default(1),
});

export async function POST(req: Request) {
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

  const body = bodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const product = getOneTimeProduct(body.data.productKey);
  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }
  if (!product.priceId) {
    return NextResponse.json({ error: "Product is not configured." }, { status: 503 });
  }

  const baseUrl = getBaseUrl();

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: session.user.stripeCustomerId || undefined,
      customer_email: session.user.stripeCustomerId ? undefined : session.user.email,
      line_items: [
        {
          price: product.priceId,
          quantity: body.data.quantity,
        },
      ],
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
        productKey: product.key,
      },
      success_url: `${baseUrl}/payment-result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: "Payment provider rejected the request." }, { status: 502 });
    }
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
