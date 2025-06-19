import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { Pricing } from "~/components/pricing";
import { getBaseUrl } from "~/lib/url";
import { createAlternates } from "~/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  // 确保params已经被解析
  const { locale } = await params;

  return {
    title: "Pricing - Boot Next.js App",
    description: "Support our open source work with a donation",
    metadataBase: new URL(getBaseUrl()),
    alternates: createAlternates("/pricing", locale),
  };
}

export default function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Combined Hero & Pricing Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-24 pb-24">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] -z-10 dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-5"></div>
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-5"></div>

        <div className="container px-4 mx-auto">
          {/* Hero content */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Support Our
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> Open Source </span>
              Work
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Boot Next.js is completely free and open source. Your donations help us maintain and improve the project.
            </p>
          </div>

          {/* Pricing component */}
          <Pricing />
        </div>
      </section>

      <Footer />
    </div>
  );
}
