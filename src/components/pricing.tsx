"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { authClient } from "~/lib/auth/client";

// Pricing plans data
const pricingPlans = [
  {
    name: "Supporter",
    price: "$9",
    priceId: "price_1Rc9G1PthsRl3XNksFERHQkW", // 请替换为真实的 Price ID
    description: "For individual developers and hobbyists.",
    features: [
      "Access to all core features",
      "Community support",
      "Special badge in the community",
      "Name on the supporters list",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    priceId: "price_1Rc9G1PthsRl3XNkjdbbCOle", // 请替换为真实的 Price ID
    description: "For professional developers and small teams.",
    features: [
      "All Supporter features",
      "Priority support",
      "Early access to new features",
    ],
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Partner",
    price: "$99",
    priceId: "price_1Rc9G1PthsRl3XNkMxgFOUmF", // 请替换为真实的 Price ID
    description: "For businesses and enterprises.",
    features: [
      "All Professional features",
      "Direct communication channel",
      "Logo on our homepage",
      "Custom feature prioritization",
    ],
    buttonText: "Contact Us",
    buttonVariant: "outline" as const,
    popular: false,
  },
];

export function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: typeof pricingPlans[number]) => {
    if (plan.priceId.includes("placeholder")) {
      console.error("Please replace the placeholder price ID in src/components/pricing.tsx with your actual Stripe price ID.");
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
        plan: plan.name.toLowerCase(),
        successUrl: `${window.location.origin}/payment-result?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: window.location.origin,
      });
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {pricingPlans.map((plan, index) => (
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
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.price !== "Custom" && <span className="text-muted-foreground ml-1">/month</span>}
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
              disabled={loading || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            >
              {loading ? "Redirecting..." : plan.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
