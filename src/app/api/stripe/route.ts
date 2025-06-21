import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "~/lib/auth/server";
import { stripe } from "~/lib/stripe/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const { priceId } = await req.json();

  if (!priceId) {
    return NextResponse.json({ error: "priceId is required" }, { status: 400 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: session.user.stripeCustomerId || undefined,
      customer_email: session.user.stripeCustomerId ? undefined : session.user.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (err) {
    console.error("Stripe API error:", err);
    if (err instanceof Stripe.errors.StripeError) {
      const { message, type } = err;
      return NextResponse.json({ error: { message, type } }, { status: 500 });
    }
    return NextResponse.json({ error: { message: "An unknown error occurred." } }, { status: 500 });
  }
}
