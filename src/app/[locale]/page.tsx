import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { CallToAction } from "~/components/landing/call-to-action";
import { Features } from "~/components/landing/features";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-muted [--page-surface:var(--muted)] dark:bg-background dark:[--page-surface:var(--background)]">
      <Header />

      <main className="flex-1">
        <Features />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
