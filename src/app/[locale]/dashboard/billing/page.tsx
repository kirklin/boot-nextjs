"use client";

import type { Subscription } from "@better-auth/stripe";
import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { authClient } from "~/lib/auth/client";
import { Link } from "~/lib/i18n/navigation";
import { formatStripeAmount } from "~/lib/stripe/format";
import { findPlanByName } from "~/lib/stripe/plans";

interface Invoice {
  id: string;
  number: string | null;
  createdAt: string;
  total: number;
  currency: string;
  status: string;
  invoiceUrl: string | null;
}

export default function BillingPage() {
  const t = useTranslations("Billing");
  const locale = useLocale();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [subResponse, invoicesResponse] = await Promise.all([
        authClient.subscription.list(),
        fetch("/api/stripe/invoices"),
      ]);

      const activeSubscription = subResponse.data?.find(
        sub => sub.status === "active" || sub.status === "trialing",
      );
      setSubscription(activeSubscription ?? null);

      if (invoicesResponse.ok) {
        setInvoices(await invoicesResponse.json());
      } else if (invoicesResponse.status !== 401 && invoicesResponse.status !== 503) {
        // 401: not signed in; 503: Stripe not configured yet — both are fine.
        toast.error(t("invoicesError"));
      }
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
      toast.error(t("invoicesError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleManageSubscription = async () => {
    // The plugin validates returnUrl against trustedOrigins and redirects
    // to the Stripe Billing Portal.
    const { error } = await authClient.subscription.billingPortal({
      returnUrl: "/dashboard/billing",
    });
    if (error) {
      toast.error(t("portalError"));
    }
  };

  const handleResumeSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) {
      return;
    }
    const { error } = await authClient.subscription.restore({
      subscriptionId: subscription.stripeSubscriptionId,
    });
    if (error) {
      toast.error(t("resumeError"));
    } else {
      toast.success(t("resumeSuccess"));
      await fetchData();
    }
  };

  const planDetails = findPlanByName(subscription?.plan);
  const currentPlanName = planDetails?.name ?? subscription?.plan ?? t("freePlan");
  // Restore works for period-end cancellations and date-scheduled ones alike.
  const isPendingCancel = !!subscription && (!!subscription.cancelAtPeriodEnd || !!subscription.cancelAt);
  const formatDate = (date: string | Date) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(date));

  if (loading) {
    return (
      <DashboardShell>
        <div className="space-y-6">
          <h2 className="text-2xl font-medium">{t("title")}</h2>
          <Card className="p-6">
            <p>{t("loading")}</p>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium">{t("title")}</h2>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{t("currentPlanTitle")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("currentPlanDescription", { plan: currentPlanName })}
              </p>
            </div>
            <Button onClick={handleManageSubscription} className="flex items-center gap-2">
              <span>{t("manageSubscription")}</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {currentPlanName}
                    {" "}
                    {t("planSuffix")}
                  </p>
                  {(planDetails || !subscription) && (
                    <p className="text-sm text-muted-foreground">
                      {planDetails ? formatStripeAmount(planDetails.price, planDetails.currency, locale) : formatStripeAmount(0, "usd", locale)}
                      {t("perMonth")}
                    </p>
                  )}
                </div>
                {subscription?.periodEnd && (
                  <div className="text-sm">
                    {isPendingCancel
                      ? t("cancelNotice", { date: formatDate(subscription.cancelAt ?? subscription.periodEnd) })
                      : t("nextBillingDate", { date: formatDate(subscription.periodEnd) })}
                  </div>
                )}
              </div>
              {isPendingCancel && (
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={handleResumeSubscription}>
                    {t("resume")}
                  </Button>
                </div>
              )}
              {planDetails && (
                <ul className="mt-4 space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      {planDetails.limits.projects === -1
                        ? t("unlimitedProjects")
                        : t("projects", { count: planDetails.limits.projects })}
                    </span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium">{t("recentInvoices")}</h3>
          <div className="mt-4">
            <div className="rounded-md border">
              <div className="divide-y">
                {invoices.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground">{t("noInvoices")}</p>
                )}
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
                        {invoice.number ?? invoice.id}
                      </button>
                      <p className="text-sm text-muted-foreground">{formatDate(invoice.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-right">
                        {formatStripeAmount(invoice.total, invoice.currency, locale)}
                      </p>
                      <p className="text-sm text-muted-foreground text-right">{invoice.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleManageSubscription} className="flex items-center justify-center gap-2">
                <span>{t("viewAllInvoices")}</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          {t.rich("billingQuestions", {
            link: chunks => (
              <Link href="/dashboard/contact" className="text-primary hover:underline">{chunks}</Link>
            ),
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
