import { NextResponse } from "next/server";
import { auth } from "~/lib/auth/server";
import { stripe } from "~/lib/stripe/server";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  try {
    const { returnUrl } = await req.json();
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.stripeCustomerId) {
      return NextResponse.json({ error: "User not found or not a Stripe customer." }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.user.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Error creating customer portal session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
