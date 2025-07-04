"use client";

import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { Card } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

const usageData = {
  tokens: {
    used: 764000,
    total: 1000000,
    percent: 76.4,
  },
  requests: {
    current: 3218,
    limit: 5000,
    percent: 64.4,
  },
  history: [
    { date: "Jun 24", tokens: 23000 },
    { date: "Jun 23", tokens: 24500 },
    { date: "Jun 22", tokens: 18700 },
    { date: "Jun 21", tokens: 31200 },
    { date: "Jun 20", tokens: 27600 },
    { date: "Jun 19", tokens: 29800 },
    { date: "Jun 18", tokens: 22400 },
  ],
};

export default function UsagePage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium">Usage</h2>

        <div className="space-y-5">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">AI Token Usage (This Month)</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold">
                {(usageData.tokens.used / 1000).toLocaleString()}
                k
              </span>
              <span className="text-sm text-muted-foreground">
                /
                {" "}
                {(usageData.tokens.total / 1000).toLocaleString()}
                k tokens
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {usageData.tokens.percent}
                  % used
                </span>
                <span className="text-muted-foreground">
                  {(usageData.tokens.total - usageData.tokens.used).toLocaleString()}
                  {" "}
                  tokens remaining
                </span>
              </div>
              <Progress value={usageData.tokens.percent} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">API Requests (This Month)</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold">{usageData.requests.current.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">
                /
                {" "}
                {usageData.requests.limit.toLocaleString()}
                {" "}
                requests
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {usageData.requests.percent}
                  % used
                </span>
                <span className="text-muted-foreground">
                  {(usageData.requests.limit - usageData.requests.current).toLocaleString()}
                  {" "}
                  requests remaining
                </span>
              </div>
              <Progress value={usageData.requests.percent} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Recent Daily Usage</h3>
            <div className="mt-4">
              <div className="space-y-2">
                {usageData.history.map(day => (
                  <div key={day.date} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-muted-foreground">{day.date}</div>
                    <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="bg-primary"
                        style={{ width: `${(day.tokens / 35000) * 100}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-xs">
                      {(day.tokens / 1000).toFixed(1)}
                      k tokens
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
