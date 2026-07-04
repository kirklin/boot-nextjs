import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "~/lib/auth/server";
import { stripe } from "~/lib/stripe/server";

// Lists the current user's recent invoices. Amounts and dates are returned
// raw so the client can format them for the active locale.

export async function GET() {
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
  if (!session.user.stripeCustomerId) {
    // No Stripe customer yet — nothing to bill.
    return NextResponse.json([]);
  }

  try {
    // Over-fetch so drafts/voided invoices don't crowd out displayable ones.
    const invoices = await stripe.invoices.list({
      customer: session.user.stripeCustomerId,
      limit: 50,
    });

    const result = invoices.data
      .filter(invoice => invoice.status === "paid" || invoice.status === "open")
      .slice(0, 12)
      .map(invoice => ({
        id: invoice.id,
        number: invoice.number,
        createdAt: new Date(invoice.created * 1000).toISOString(),
        total: invoice.total,
        currency: invoice.currency,
        status: invoice.status,
        invoiceUrl: invoice.hosted_invoice_url ?? null,
      }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
