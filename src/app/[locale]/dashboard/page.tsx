"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function DashboardPage() {
  // Mock data - in a real app, this would come from Better Auth API
  const [currentPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "For personal projects or learning",
      features: [
        "1,000 API credits per month",
        "Basic features access",
        "Email support (24-48h response)",
      ],
      active: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For professionals and small teams",
      features: [
        "10,000 API credits per month",
        "Advanced features",
        "Priority support (24h response)",
        "Team collaboration",
      ],
      active: false,
    },
    {
      id: "ultra",
      name: "Ultra",
      price: "$49",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Unlimited API credits",
        "All features included",
        "Premium support (12h response)",
        "Advanced analytics",
        "Custom integration",
      ],
      active: false,
    },
  ];

  const usageStats = {
    used: 764,
    total: 1000,
    percentage: 76.4,
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium">Overview</h2>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <Card
              key={plan.id}
              className={`flex flex-col ${plan.id === currentPlan ? "border-primary" : ""}`}
            >
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.id === currentPlan && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {plan.id === currentPlan
                        ? (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                          )
                        : (
                            <Circle className="h-4 w-4 shrink-0 mr-2 mt-0.5" />
                          )}
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.id === currentPlan
                  ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    )
                  : (
                      <Button variant="default" className="w-full">
                        Upgrade to
                        {" "}
                        {plan.name}
                      </Button>
                    )}
              </CardFooter>
            </Card>
          ))}
        </div>

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
