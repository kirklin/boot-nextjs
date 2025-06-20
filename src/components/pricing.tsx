"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getStripe } from "~/lib/stripe/client";
import { subscriptionPlans } from "~/lib/stripe/plans";

export function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: (typeof subscriptionPlans)[number]) => {
    if (plan.name === "Partner") {
      // Handle contact for custom plan
      window.location.href = "mailto:contact@example.com";
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: plan.priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session.");
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Stripe redirect error:", error);
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {subscriptionPlans.map((plan, index) => (
        <Card
          key={index}
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
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
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
              disabled={loading}
            >
              {loading ? "Redirecting..." : plan.name === "Partner" ? "Contact Us" : "Get Started"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
