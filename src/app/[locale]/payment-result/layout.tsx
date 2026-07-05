import type { Metadata } from "next";

// Transactional page — keep out of search indexes (also disallowed in robots.ts).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PaymentResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
