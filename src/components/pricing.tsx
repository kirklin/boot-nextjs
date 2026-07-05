"use client";

import type { Subscription } from "@better-auth/stripe";
import { CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/lib/auth/client";
import { useRouter } from "~/lib/i18n/navigation";
import { formatStripeAmount } from "~/lib/stripe/format";
import { findPlanByName, isSamePlan, subscriptionPlans } from "~/lib/stripe/plans";

type BillingInterval = "month" | "year";

export function Pricing() {
  const t = useTranslations("Pricing");
  const locale = useLocale();
  const [interval, setInterval] = useState<BillingInterval>("month");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [downgradeTarget, setDowngradeTarget] = useState<(typeof subscriptionPlans)[number] | null>(null);
  const { data: user } = authClient.useSession();
  const router = useRouter();
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (user) {
      authClient.subscription.list().then(({ data }) => {
        const sub = data?.find(s => s.status === "active" || s.status === "trialing");
        setActiveSubscription(sub ?? null);
      }).catch(() => {
        toast.error(t("subscriptionLoadError"));
      });
    }
  }, [user, t]);

  const currentPlan = findPlanByName(activeSubscription?.plan);
  const currentInterval: BillingInterval = activeSubscription?.billingInterval === "year" ? "year" : "month";

  const changePlan = async (plan: (typeof subscriptionPlans)[number], scheduleAtPeriodEnd: boolean) => {
    setLoadingPlan(plan.name);
    try {
      // Upgrades confirm through the Billing Portal and invoice immediately;
      // downgrades are scheduled for the end of the current period.
      const { error } = await authClient.subscription.upgrade({
        plan: plan.name,
        annual: interval === "year",
        successUrl: "/dashboard/billing",
        cancelUrl: "/pricing",
        returnUrl: "/dashboard/billing",
        ...(scheduleAtPeriodEnd && { scheduleAtPeriodEnd: true }),
        ...(activeSubscription?.stripeSubscriptionId && {
          subscriptionId: activeSubscription.stripeSubscriptionId,
        }),
      });
      if (error) {
        // A bare 404 (no error code) means the Stripe plugin isn't registered
        // — the deployment is missing the STRIPE_* environment variables.
        if (error.status === 404 && !error.code) {
          console.warn("[stripe] Subscription endpoints are not registered — set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET (see README).");
          toast.error(t("billingNotConfigured"));
        } else {
          toast.error(error.message ?? t("checkoutError"));
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(t("checkoutError"));
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSelect = (plan: (typeof subscriptionPlans)[number]) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    const isDowngrade = !!currentPlan && plan.price < currentPlan.price;
    if (isDowngrade) {
      setDowngradeTarget(plan);
      return;
    }
    changePlan(plan, false);
  };

  const effectiveDate = activeSubscription?.periodEnd
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(activeSubscription.periodEnd))
    : null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-center mb-8">
        <Tabs value={interval} onValueChange={value => setInterval(value as BillingInterval)}>
          <TabsList>
            <TabsTrigger value="month">{t("monthly")}</TabsTrigger>
            <TabsTrigger value="year">
              {t("annual")}
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {t("annualSave")}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptionPlans.map((plan) => {
          const isCurrent = isSamePlan(plan.name, activeSubscription?.plan) && interval === currentInterval;
          const isIntervalSwitch = isSamePlan(plan.name, activeSubscription?.plan) && interval !== currentInterval;
          const isDowngrade = !!currentPlan && plan.price < currentPlan.price;
          const displayAmount = interval === "year" ? plan.annualPrice : plan.price;

          return (
            <Card
              key={plan.name}
              className={`border relative ${plan.popular ? "border-primary shadow-md" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {t("recommended")}
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {formatStripeAmount(displayAmount, plan.currency, locale)}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    {interval === "year" ? t("perYear") : t("perMonth")}
                  </span>
                </div>
                {plan.freeTrialDays && !activeSubscription && (
                  <p className="mt-1 text-sm text-primary">
                    {t("freeTrial", { days: plan.freeTrialDays })}
                  </p>
                )}
                <CardDescription className="mt-2">{t(`plans.${plan.key}.description`)}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-2">
                  {(t.raw(`plans.${plan.key}.features`) as string[]).map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant}
                  className="w-full"
                  size="lg"
                  onClick={() => handleSelect(plan)}
                  disabled={loadingPlan !== null || isCurrent}
                >
                  {loadingPlan === plan.name
                    ? t("redirecting")
                    : isCurrent
                      ? t("currentPlan")
                      : isIntervalSwitch
                        ? t("switchBilling")
                        : isDowngrade
                          ? t("downgrade")
                          : t("upgrade")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={downgradeTarget !== null} onOpenChange={open => !open && setDowngradeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("downgradeTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {effectiveDate
                ? t("downgradeDescription", { plan: downgradeTarget?.name ?? "", date: effectiveDate })
                : t("downgradeDescriptionNoDate", { plan: downgradeTarget?.name ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("downgradeCancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (downgradeTarget) {
                  changePlan(downgradeTarget, true);
                }
                setDowngradeTarget(null);
              }}
            >
              {t("downgradeConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
