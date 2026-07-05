"use client";

import type { Subscription } from "@better-auth/stripe";
import { CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { authClient } from "~/lib/auth/client";
import { useRouter } from "~/lib/i18n/navigation";
import { formatStripeAmount } from "~/lib/stripe/format";
import { findPlanByName, isSamePlan, subscriptionPlans } from "~/lib/stripe/plans";

export function Pricing() {
  const t = useTranslations("Pricing");
  const locale = useLocale();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
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

  const handleCheckout = async (plan: (typeof subscriptionPlans)[number]) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setLoadingPlan(plan.name);
    try {
      // For a first subscription this redirects to Stripe Checkout (successUrl);
      // for a plan change it confirms through the Billing Portal (returnUrl).
      const { error } = await authClient.subscription.upgrade({
        plan: plan.name,
        successUrl: "/dashboard/billing",
        cancelUrl: "/pricing",
        returnUrl: "/dashboard/billing",
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {subscriptionPlans.map((plan) => {
        const isCurrent = isSamePlan(plan.name, activeSubscription?.plan);
        const isDowngrade = !!currentPlan && plan.price < currentPlan.price;

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
                  {formatStripeAmount(plan.price, plan.currency, locale)}
                </span>
                <span className="text-muted-foreground ml-1">{t("perMonth")}</span>
              </div>
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
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan !== null || isCurrent || isDowngrade}
              >
                {loadingPlan === plan.name
                  ? t("redirecting")
                  : isCurrent
                    ? t("currentPlan")
                    : t("upgrade")}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
