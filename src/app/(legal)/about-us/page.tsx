import type { Metadata } from "next";
import { ChevronRight, Github, GraduationCap, Shield, Sparkles } from "lucide-react";
import Image from "next/image";
import { JsonLd } from "~/components/JsonLd";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyLead,
  TypographyP,
  TypographySmall,
} from "~/components/ui/typography";
import { Link } from "~/lib/i18n/navigation";
import { createAlternates } from "~/lib/utils";
import { createOrganizationJsonLd } from "~/lib/utils/jsonld";

import { Container } from "../components/container";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  // 确保params已经被解析
  const { locale } = await params;

  return {
    title: "About Us | boot-nextjs",
    // TODO: Update the description
    description: "About boot-nextjs - A Next.js boilerplate.",
    alternates: createAlternates("/about-us", locale),
  };
}

export default function AboutUsPage() {
  const organizationJsonLd = createOrganizationJsonLd();
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="flex flex-col min-h-screen py-12">
      <JsonLd data={organizationJsonLd} />

      <Container className="space-y-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>About Us</span>
          </div>

          <TypographyH1>About Us</TypographyH1>
          <TypographyLead>
            We are a team of passionate developers dedicated to creating high-quality software.
          </TypographyLead>
          <TypographySmall className="text-muted-foreground">
            Last Updated:
            {" "}
            {lastUpdated}
          </TypographySmall>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <TypographyP>
            This is a boilerplate for Next.js projects. It includes a set of best practices and tools to help you get started with your next project.
          </TypographyP>
        </section>

        {/* Our Mission */}
        <section className="space-y-4">
          <TypographyH2>Our Mission</TypographyH2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <TypographyH3 className="text-xl font-medium">Open Source</TypographyH3>
                <TypographyP className="mt-2 text-muted-foreground">
                  Our boilerplate is open source and available on GitHub.
                </TypographyP>
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <TypographyH3 className="text-xl font-medium">Best Practices</TypographyH3>
                <TypographyP className="mt-2 text-muted-foreground">
                  We follow the best practices for Next.js development.
                </TypographyP>
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <TypographyH3 className="text-xl font-medium">Easy to Use</TypographyH3>
                <TypographyP className="mt-2 text-muted-foreground">
                  Our boilerplate is easy to use and customize.
                </TypographyP>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Our Platform */}
        <section className="space-y-4">
          <TypographyH2>About Our Platform</TypographyH2>

          <TypographyP>
            Our platform is built on top of Next.js, a popular React framework for building server-rendered applications.
          </TypographyP>

          <TypographyH3 className="mt-4">Our Approach</TypographyH3>
          <TypographyP>
            We believe in creating tools that are:
          </TypographyP>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Simple and intuitive</strong>
              {" "}
              - designed for both beginners and advanced users
            </li>
            <li>
              <strong>Fast and efficient</strong>
              {" "}
              - optimized for performance
            </li>
            <li>
              <strong>Privacy-respecting</strong>
              {" "}
              - all processing happens in your browser
            </li>
            <li>
              <strong>Accessible</strong>
              {" "}
              - available to anyone with a web browser
            </li>
            <li>
              <strong>Valuable</strong>
              {" "}
              - solving real problems for Markdown users
            </li>
          </ul>
        </section>

        {/* Revenue Model */}
        <section className="space-y-4">
          <TypographyH2>Our Revenue Model</TypographyH2>

          <TypographyP>
            We are committed to keeping our boilerplate free and open source.
          </TypographyP>

          <div className="mt-4 space-y-2">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">1</span>
                </div>
              </div>
              <div>
                <strong>Community-driven</strong>
                : We are a community-driven project and welcome contributions from everyone.
              </div>
            </div>
          </div>

          <TypographyP className="mt-4">
            We are committed to providing a high-quality boilerplate that is easy to use and customize.
          </TypographyP>
        </section>

        {/* About the Developer */}
        <section className="space-y-4">
          <TypographyH2>About the Developer</TypographyH2>

          <div className="flex flex-col md:flex-row gap-8 items-center p-6 border rounded-lg bg-card">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-primary/20">
                <Image
                  src="https://avatars.githubusercontent.com/u/17453452?v=4"
                  alt="Kirk Lin"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <TypographyH3 className="text-xl font-medium">Kirk Lin</TypographyH3>
                <p className="text-muted-foreground">Creator & Developer</p>
              </div>
              <TypographyP>
                This boilerplate was created by a team of developers passionate about creating tools that simplify workflows and make technology more accessible.
              </TypographyP>
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/kirklin" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <TypographyH2>Contact Information</TypographyH2>

          <TypographyP>
            If you have any questions, suggestions, or feedback, please contact us at
            {" "}
            {/* TODO: Replace with your own email */}
            <a
              href="mailto:support@example.com"
              className="text-primary hover:underline"
            >
              support@example.com
            </a>
            .
          </TypographyP>

          <TypographyP>
            You can also find the project on GitHub:
            {" "}
            <a
              href="https://github.com/kirklin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              <Github className="mr-1 h-4 w-4" />
              github.com/kirklin
            </a>
          </TypographyP>
        </section>

        {/* Acceptance */}
        <section className="py-4 border-t border-border">
          <TypographyP className="text-center text-muted-foreground">
            By using this boilerplate, you acknowledge that you have read and understood our Terms of Use and Privacy Policy.
          </TypographyP>
        </section>
      </Container>
    </main>
  );
}
