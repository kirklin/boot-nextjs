"use client";

import type { Subscription } from "@better-auth/stripe";
import { ArrowUpRight, CreditCard } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/lib/auth/client";
import { Link } from "~/lib/i18n/navigation";
import { formatStripeAmount } from "~/lib/stripe/format";
import { findPlanByName, getHighlightedPlan } from "~/lib/stripe/plans";

export default function DashboardPage() {
  const t = useTranslations("Billing");
  const locale = useLocale();
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const { data } = await authClient.subscription.list();
        if (data && data.length > 0) {
          const activeSubscription = data.find(sub => sub.status === "active" || sub.status === "trialing");
          setSubscription(activeSubscription || null);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      }
    }
    fetchSubscription();
  }, []);

  const currentPlanDetails = findPlanByName(subscription?.plan);
  const currentPlanName = currentPlanDetails?.name ?? subscription?.plan ?? t("freePlan");
  // Only suggest an upgrade when there is a higher tier than the current plan.
  const upgradeSuggestion = getHighlightedPlan(subscription?.plan);
  const formatDate = (date: string | Date) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(date));

  const usageStats = {
    used: 764, // This should be fetched from a relevant API
    total: currentPlanDetails?.limits.projects === -1 ? Infinity : (currentPlanDetails?.limits.projects || 1) * 1000,
    percentage: currentPlanDetails?.limits.projects === -1 ? 0 : (764 / ((currentPlanDetails?.limits.projects || 1) * 1000)) * 100,
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium">Overview</h2>
        </div>

        {/* Current plan summary — plan changes happen on /pricing and /dashboard/billing */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {currentPlanName}
                  {" "}
                  {t("planSuffix")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentPlanDetails
                    ? `${formatStripeAmount(
                      subscription?.billingInterval === "year" ? currentPlanDetails.annualPrice : currentPlanDetails.price,
                      currentPlanDetails.currency,
                      locale,
                    )}${subscription?.billingInterval === "year" ? t("perYear") : t("perMonth")}`
                    : t("freePlanDescription")}
                  {subscription?.status === "trialing" && subscription.trialEnd
                    ? ` · ${t("trialNotice", { date: formatDate(subscription.trialEnd) })}`
                    : subscription?.periodEnd
                      ? ` · ${t("nextBillingDate", { date: formatDate(subscription.periodEnd) })}`
                      : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {upgradeSuggestion && (
                <Button asChild>
                  <Link href="/pricing">
                    {t("upgradeCta", { plan: upgradeSuggestion.name })}
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href="/dashboard/billing">{t("manageSubscription")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Usage Overview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Usage Overview</CardTitle>
                <CardDescription>
                  Your current API credits usage this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Credits Used</div>
                      <div className="text-sm font-medium">
                        {usageStats.used}
                        {" "}
                        /
                        {" "}
                        {usageStats.total}
                      </div>
                    </div>
                    <Progress className="mt-2" value={usageStats.percentage} />
                  </div>

                  <div className="text-sm text-muted-foreground mt-2">
                    {Math.round((1 - usageStats.percentage / 100) * 30)}
                    {" "}
                    days remaining this month
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">API Requests Today</div>
                <div className="mt-2 text-2xl font-bold">328</div>
                <div className="mt-1 text-xs text-muted-foreground">+12% from yesterday</div>
              </Card>

              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Successful Requests</div>
                <div className="mt-2 text-2xl font-bold">98.2%</div>
                <div className="mt-1 text-xs text-muted-foreground">+0.5% from last week</div>
              </Card>

              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Active Projects</div>
                <div className="mt-2 text-2xl font-bold">3</div>
                <div className="mt-1 text-xs text-muted-foreground">No change from last month</div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Usage</CardTitle>
                <CardDescription>Your API usage details and history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This would normally show detailed usage statistics */}
                  <p className="text-muted-foreground">
                    Detailed API usage statistics and graphs would be displayed here,
                    integrated with Better Auth's API tracking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
