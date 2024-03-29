import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Analytics from "~/components/Analytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boot Next.js App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="app">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
