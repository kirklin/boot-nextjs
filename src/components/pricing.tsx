"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { authClient } from "~/lib/auth/client";
import { useRouter } from "~/lib/i18n/navigation";
import { subscriptionPlans } from "~/lib/stripe/plans";

export function Pricing() {
  const [loading, setLoading] = useState(false);
  const { data: user } = authClient.useSession();
  const router = useRouter();
  const [activeSubscription, setActiveSubscription] = useState<any>(null);

  useEffect(() => {
    if (user) {
      authClient.subscription.list().then(({ data }) => {
        const sub = data?.find(s => s.status === "active" || s.status === "trialing");
        setActiveSubscription(sub || null);
      });
    }
  }, [user]);

  const handleCheckout = async (plan: (typeof subscriptionPlans)[number]) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (plan.name === "Partner") {
      // Handle contact for custom plan
      window.location.href = "mailto:contact@example.com";
      return;
    }

    setLoading(true);
    try {
      await authClient.subscription.upgrade({
        plan: plan.name,
        successUrl: `${window.location.origin}/dashboard/billing`,
        cancelUrl: window.location.href,
        ...(activeSubscription && { subscriptionId: activeSubscription.id }),
      });
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {subscriptionPlans.map(plan => (
        <Card
          key={plan.name}
          className={`border relative ${plan.popular ? "border-primary shadow-md" : ""}`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
              <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Recommended
              </span>
            </div>
          )}

          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                $
                {plan.price / 100}
              </span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <CardDescription className="mt-2">{plan.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <ul className="space-y-2">
              {plan.features.map(feature => (
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
              disabled={
                loading
                || (activeSubscription
                  && plan.price
                  < (subscriptionPlans.find(p => p.name === activeSubscription.plan)
                    ?.price ?? Infinity))
                  || plan.name === activeSubscription?.plan
              }
            >
              {loading
                ? "Redirecting..."
                : plan.name === activeSubscription?.plan
                  ? "Current Plan"
                  : "Upgrade"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
