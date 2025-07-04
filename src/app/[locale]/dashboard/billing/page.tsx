"use client";

import type { Subscription } from "@better-auth/stripe";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { authClient } from "~/lib/auth/client";
import { Link } from "~/lib/i18n/navigation";
import { subscriptionPlans } from "~/lib/stripe/plans";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  invoiceUrl?: string;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [subResponse, invoicesResponse] = await Promise.all([
          authClient.subscription.list(),
          fetch("/api/stripe/invoices"),
        ]);

        if (subResponse.data && subResponse.data.length > 0) {
          const activeSubscription = subResponse.data.find(sub => sub.status === "active" || sub.status === "trialing");
          setSubscription(activeSubscription || null);
        }

        if (invoicesResponse.ok) {
          const invoiceData = await invoicesResponse.json();
          setInvoices(invoiceData);
        } else {
          console.error("Failed to fetch invoices");
        }
      } catch (error) {
        console.error("Failed to fetch billing data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create portal session.");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error managing subscription:", error);
    }
  };

  const currentPlan = subscription ? subscription.plan : "Free";
  const nextBillingDate = subscription?.periodEnd ? new Date(subscription.periodEnd).toLocaleDateString() : "N/A";
  const planDetails = subscription ? subscriptionPlans.find(p => p.name.toLowerCase() === subscription.plan.toLowerCase()) : null;
  const planPrice = planDetails ? `$${planDetails.price / 100}` : "$0";

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <h2 className="text-2xl font-medium">Billing & Invoices</h2>
          <Card className="p-6">
            <p>Loading billing information...</p>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium">Billing & Invoices</h2>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                You are currently on the
                {" "}
                {currentPlan}
                {" "}
                plan.
              </p>
            </div>
            <Button onClick={handleManageSubscription} className="flex items-center gap-2">
              <span>Manage Subscription</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {currentPlan}
                    {" "}
                    Plan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {planPrice}
                    /month
                  </p>
                </div>
                <div className="text-sm">
                  Next billing date:
                  {" "}
                  {nextBillingDate}
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    {planDetails?.limits?.projects === -1 ? "Unlimited" : (planDetails?.limits?.projects || 0)}
                    {" "}
                    projects
                  </span>
                </li>
                {/* Add other features based on the plan */}
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium">Recent Invoices</h3>
          <div className="mt-4">
            <div className="rounded-md border">
              <div className="divide-y">
                {/* TODO: Fetch real invoices from Stripe API */}
                {invoices.map(invoice => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <button
                        type="button"
                        onClick={() => invoice.invoiceUrl && window.open(invoice.invoiceUrl, "_blank")}
                        className="font-medium text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
                        disabled={!invoice.invoiceUrl}
                      >
                        {invoice.id}
                      </button>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="font-medium text-right">{invoice.amount}</p>
                      <p className="text-sm text-muted-foreground text-right">{invoice.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleManageSubscription} className="flex items-center justify-center gap-2">
                <span>View All Invoices</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          For billing questions, please
          {" "}
          <Link href="/dashboard/contact" className="text-primary hover:underline">contact support</Link>
          .
        </div>
      </div>
    </DashboardShell>
  );
}
