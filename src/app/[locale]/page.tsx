import {
  CreditCard,
  Globe,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Zap,
} from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { BentoLayout } from "~/components/landing/bento-layout";
import { Header } from "~/components/layout/header";

import { caseStudies } from "~/data/case-studies";

// Features section data
const features = [
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Next.js 16",
    description: "Built on the latest version of React framework with App Router and Server Components",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Internationalization",
    description: "Built-in i18n support with next-intl for multilingual applications",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "TypeScript",
    description: "Type-safe code with TypeScript for better developer experience",
  },
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: "Dashboard Ready",
    description: "Pre-built dashboard layout with authentication and user management",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Payment Integration",
    description: "Ready-to-use payment integration with Stripe for subscription management",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "AI Integration",
    description: "Easy integration with OpenAI and other AI services for your SaaS product",
  },
];

// Features section data

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1">
        <BentoLayout features={features} caseStudies={caseStudies} />
      </main>
    </div>
  );
}
