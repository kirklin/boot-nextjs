import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "~/lib/stripe/server";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }
  const { priceId } = await req.json();

  // Log the key prefix to verify which key is being used (test vs. live)
  console.warn("Using Stripe key with prefix:", process.env.STRIPE_SECRET_KEY?.substring(0, 8));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe API error:", err);
    if (err instanceof Stripe.errors.StripeError) {
      const { message, type } = err;
      return NextResponse.json({ error: { message, type } }, { status: 500 });
    }
    // Handle non-Stripe errors
    return NextResponse.json({ error: { message: "An unknown error occurred." } }, { status: 500 });
  }
}
