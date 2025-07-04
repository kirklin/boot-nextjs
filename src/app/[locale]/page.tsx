import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Github,
  Globe,
  Layers,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { Pricing } from "~/components/pricing";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

// Features section data
const features = [
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Next.js 15",
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

// Case studies data
const caseStudies = [
  {
    title: "MDUtil",
    description: "A suite of Markdown utilities for content creators and developers",
    image: "/case-studies/mdutil.png",
    url: "https://mdutil.com",
    tags: ["Next.js", "Markdown", "Tailwind CSS"],
  },
];

// FAQ data
const faqs = [
  {
    question: "Is Boot Next.js free to use?",
    answer: "Yes, Boot Next.js is completely free and open source. You can use it for personal, commercial, or open source projects without any restrictions.",
  },
  {
    question: "How do I get started with Boot Next.js?",
    answer: "Clone the repository, install the dependencies, and follow the setup instructions in the documentation. You'll have a working application in minutes.",
  },
  {
    question: "Can I use Boot Next.js for commercial projects?",
    answer: "Absolutely! Boot Next.js is licensed under MIT, which means you can use it for any project, including commercial ones.",
  },
  {
    question: "How can I contribute to Boot Next.js?",
    answer: "We welcome contributions! You can contribute by submitting issues, pull requests, or helping with documentation. Check our GitHub repository for more details.",
  },
];

export default function HomePage({
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

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-24 pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] -z-10 dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>

        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm rounded-full">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>Next.js 15 + TypeScript + Tailwind CSS</span>
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                The Ultimate Starter for
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> AI SaaS </span>
                Projects
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Build production-ready AI applications with authentication, internationalization, payments, and more. Get started in minutes.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="https://github.com/kirklin/boot-nextjs" target="_blank">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="https://github.com/kirklin/boot-nextjs" target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    Star on GitHub
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Open Source</span>
                <span className="mx-2">•</span>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>MIT License</span>
                <span className="mx-2">•</span>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Regular Updates</span>
              </div>
            </div>

            <div className="flex-1 relative max-w-md">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>

              <div className="relative bg-background rounded-xl shadow-xl border overflow-hidden">
                <div className="flex items-center gap-2 bg-muted/50 p-4 border-b">
                  <div className="size-3 rounded-full bg-red-500"></div>
                  <div className="size-3 rounded-full bg-yellow-500"></div>
                  <div className="size-3 rounded-full bg-green-500"></div>
                  <div className="text-sm text-muted-foreground ml-2">Terminal</div>
                </div>

                <div className="bg-black text-green-400 p-4 font-mono text-sm">
                  <p className="mb-1">$ git clone https://github.com/kirklin/boot-nextjs.git</p>
                  <p className="mb-1">$ cd boot-nextjs</p>
                  <p className="mb-1">$ pnpm install</p>
                  <p className="mb-1">$ pnpm dev</p>
                  <p className="text-white">✓ Success! Your Next.js 15 AI SaaS project is running!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Build AI SaaS</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Boot Next.js comes with all the features you need to build a production-ready AI SaaS application.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(feature => (
              <Card key={feature.title} className="border bg-background hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-lg w-fit text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="border-dashed bg-background hover:border-primary/30 hover:shadow-md transition-all duration-300 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  And Much More...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  Drizzle ORM, Authentication with Better Auth, Tailwind CSS, shadcn/ui components,
                  Dark mode, ESLint, and more. Everything is configured and ready to use.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="w-full py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built With Boot Next.js</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how others are using Boot Next.js to build amazing applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map(study => (
              <Link key={study.url} href={study.url} target="_blank" className="group">
                <Card className="overflow-hidden border hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {study.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">{study.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {study.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Support Our Open Source Work</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Boot Next.js is completely free and open source. Your donations help us maintain and improve the project.
            </p>
          </div>
          <Pricing />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Have questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map(faq => (
              <Card key={faq.question} className="bg-background">
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your AI SaaS?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Get started with Boot Next.js today and build your next great idea with the best open source tools and practices.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href="https://github.com/kirklin/boot-nextjs" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </Link>
            </Button>

            <Button asChild size="lg" className="rounded-full bg-background text-primary hover:bg-background/90">
              <Link href="https://github.com/kirklin/boot-nextjs" target="_blank">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-sm opacity-80">
            MIT Licensed. Free and open-source.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
