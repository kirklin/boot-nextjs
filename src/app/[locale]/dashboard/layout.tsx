import type { Metadata } from "next";

// Private app area — keep out of search indexes (also disallowed in robots.ts).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
