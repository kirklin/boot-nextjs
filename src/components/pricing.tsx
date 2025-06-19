"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getStripe } from "~/lib/stripe/client";

// Pricing plans data
const pricingPlans = [
  {
    name: "Community",
    price: "Free",
    description: "For open source and community projects",
    features: [
      "All core features",
      "TypeScript support",
      "Community support",
      "GitHub discussions",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Sponsor",
    price: "$19",
    description: "Support our open source work with a donation",
    features: [
      "All Community features",
      "Priority issue resolution",
      "GitHub sponsor badge",
      "Name in contributors list",
      "Good karma ✨",
    ],
    buttonText: "Donate",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations that need additional support",
    features: [
      "All Sponsor features",
      "Custom feature development",
      "Email support",
      "Consulting hours",
      "Custom branding options",
    ],
    buttonText: "Contact Us",
    buttonVariant: "outline" as const,
    popular: false,
  },
];

export function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    if (priceId === "price_1PQiSgRrxNozT13s9qAAR1fB") {
      console.error("Please replace the placeholder price ID in src/components/pricing.tsx with your actual Stripe price ID.");
      return;
    }
    setLoading(true);
    const stripe = await getStripe();
    if (!stripe) {
      console.error("Stripe.js has not loaded yet.");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId }),
    });
    const { sessionId, error } = await res.json();
    if (error) {
      console.error("Error from API:", JSON.stringify(error, null, 2));
      setLoading(false);
      return;
    }
    await stripe.redirectToCheckout({ sessionId });
    setLoading(false);
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
              {plan.price !== "Custom" && plan.price !== "Free" && <span className="text-muted-foreground ml-1">/month</span>}
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
              onClick={() => {
                if (plan.name === "Sponsor") {
                  // This is a placeholder price ID.
                  // In a real application, you would fetch this from your database.
                  handleCheckout("price_1RbNfvPthsRl3XNkduOFHQ7N");
                }
              }}
              disabled={(loading && plan.name === "Sponsor") || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            >
              {loading && plan.name === "Sponsor" ? "Redirecting..." : plan.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
