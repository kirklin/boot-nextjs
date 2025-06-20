"use client";

import { Mail } from "lucide-react";
import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { Card } from "~/components/ui/card";

export default function ContactPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium">Contact Us</h2>

        <Card className="p-6">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>

            <h3 className="text-xl font-medium">Support Inquiries</h3>

            <p className="mt-2 text-muted-foreground">
              For all support inquiries, including billing issues, receipts,
              and general assistance, please email our support team.
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              We typically respond to all inquiries within 24 hours during business days.
            </p>

            <div className="mt-6 rounded-md bg-muted p-4">
              <p className="text-sm font-medium">support@example.com</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
