"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function DashboardPage() {
  // Demo data — replace with your real product metrics.
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
