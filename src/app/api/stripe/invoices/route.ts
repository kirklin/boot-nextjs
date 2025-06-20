import { NextResponse } from "next/server";
import { auth } from "~/lib/auth/server";
import { stripe } from "~/lib/stripe/server";

export async function GET(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.stripeCustomerId) {
      return NextResponse.json({ error: "User not found or not a Stripe customer." }, { status: 404 });
    }

    const invoices = await stripe.invoices.list({
      customer: session.user.stripeCustomerId,
      limit: 10,
    });

    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.number, // Use invoice number for display
      date: new Date(invoice.created * 1000).toLocaleDateString(),
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: invoice.currency,
      }).format(invoice.amount_paid / 100),
      status: invoice.status,
      invoiceUrl: invoice.hosted_invoice_url,
    }));

    return NextResponse.json(formattedInvoices);
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
