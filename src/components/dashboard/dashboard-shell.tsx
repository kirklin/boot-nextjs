"use client";

import type { ReactNode } from "react";
import { DashboardNav } from "~/components/dashboard/dashboard-nav";
import { UserNav } from "~/components/dashboard/user-nav";
import { ModeToggle } from "~/components/theme-toggle";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Dashboard sidebar navigation */}
      <DashboardNav />

      {/* Main content */}
      <div className="flex w-full flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-end border-b px-6">
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
