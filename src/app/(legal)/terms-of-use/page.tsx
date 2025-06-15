import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "~/components/JsonLd";
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
import { createWebsiteJsonLd } from "~/lib/utils/jsonld";

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
    // TODO: Update the description
    title: "Terms of Use | boot-nextjs",
    description: "Terms of Use for boot-nextjs. Learn about the rules and regulations governing the use of our services.",
    alternates: createAlternates("/terms-of-use", locale),
  };
}

export default function TermsOfUsePage() {
  const websiteJsonLd = createWebsiteJsonLd();
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="flex flex-col min-h-screen py-12">
      <JsonLd data={websiteJsonLd} />

      <Container className="space-y-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Terms of Use</span>
          </div>

          <TypographyH1>Terms of Use</TypographyH1>
          <TypographyLead>
            Please read these terms carefully before using our services.
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
            Welcome to boot-nextjs ("we," "our," or "us"). By accessing or using our website at
            {" "}
            {/* TODO: Replace with your own domain */}
            <Link href="/" className="text-primary hover:underline">
              example.com
            </Link>
            {" "}
            ("Website"), you agree to be bound by these Terms of Use. If you disagree with any part of these terms, you may not access our Website.
          </TypographyP>

          <TypographyP>
            We may update these Terms of Use from time to time. Any changes will be effective immediately upon posting the updated Terms on this page, with the "Last Updated" date at the top revised accordingly. Your continued use of the Website after any such changes constitutes your acceptance of the revised Terms.
          </TypographyP>
        </section>

        {/* Service Description */}
        <section className="space-y-4">
          <TypographyH2>1. Service Description</TypographyH2>

          <TypographyP>
            boot-nextjs provides a boilerplate for Next.js projects. All tools are provided on an "as is" and "as available" basis.
          </TypographyP>

          <TypographyP>
            We strive to ensure high availability and reliability of our services, but we do not guarantee that the Website will be available at all times or that access will be uninterrupted or error-free.
          </TypographyP>
        </section>

        {/* User Obligations */}
        <section className="space-y-4">
          <TypographyH2>2. User Obligations</TypographyH2>

          <TypographyP>
            When using our Website, you agree to:
          </TypographyP>

          <ul className="list-disc pl-6 space-y-2">
            <li>Use the services for lawful purposes only and in accordance with these Terms.</li>
            <li>Not attempt to interfere with, disrupt, or gain unauthorized access to any parts of the Website or its servers.</li>
            <li>Not use automated means or scripts to access or use the Website in ways that could unfairly burden our infrastructure.</li>
            <li>Not attempt to bypass any measures we may use to prevent or restrict access to the Website.</li>
            <li>Not engage in any activity that could disable, damage, or impair the functioning of the Website.</li>
          </ul>
        </section>

        {/* Privacy */}
        <section className="space-y-4">
          <TypographyH2>3. Privacy and Data Processing</TypographyH2>

          <TypographyP>
            We are committed to protecting your privacy. Our approach to data processing is as follows:
          </TypographyP>

          <TypographyH3 className="mt-4">3.1 Client-Side Processing</TypographyH3>
          <TypographyP>
            All content processing (such as Markdown rendering, word counting, and other conversions) happens entirely within your browser. The data you input into our tools is processed locally on your device and is not transmitted to or stored on our servers.
          </TypographyP>

          <TypographyH3 className="mt-4">3.2 Google Analytics and Cookies</TypographyH3>
          <TypographyP>
            We use Google Analytics to collect anonymous usage data to help us improve our services. This may involve the use of cookies to track user behavior on our Website. You can control cookies through your browser settings.
          </TypographyP>

          <TypographyH3 className="mt-4">3.3 Advertising</TypographyH3>
          <TypographyP>
            We display Google AdSense advertisements on our Website to support our free services. These ads may use cookies to personalize content and serve relevant advertisements. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.
          </TypographyP>

          <TypographyP>
            You may opt out of personalized advertising by visiting
            {" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Ads Settings
            </a>
            .
          </TypographyP>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <TypographyH2>4. Intellectual Property</TypographyH2>

          <TypographyP>
            The Website and its content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
          </TypographyP>

          <TypographyH3 className="mt-4">4.1 Our Content</TypographyH3>
          <TypographyP>
            Our Website design, logos, text, graphics, and other materials created by us and appearing on the Website are our property. You may not copy, reproduce, distribute, or use these materials without our prior written consent, except as provided below.
          </TypographyP>

          <TypographyH3 className="mt-4">4.2 Limited License</TypographyH3>
          <TypographyP>
            We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Website for personal, non-commercial purposes in accordance with these Terms.
          </TypographyP>

          <TypographyH3 className="mt-4">4.3 Your Content</TypographyH3>
          <TypographyP>
            You retain all rights to any content you input, upload, or otherwise submit to our tools. Since we do not store your content on our servers, we make no claims of ownership over materials you provide to our service.
          </TypographyP>
        </section>

        {/* Disclaimers */}
        <section className="space-y-4">
          <TypographyH2>5. Disclaimers and Limitations of Liability</TypographyH2>

          <TypographyH3 className="mt-4">5.1 No Warranties</TypographyH3>
          <TypographyP>
            THE WEBSITE AND ITS SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </TypographyP>

          <TypographyP>
            We do not warrant that the Website will be uninterrupted or error-free, that defects will be corrected, or that the Website or the server that makes it available are free of viruses or other harmful components.
          </TypographyP>

          <TypographyH3 className="mt-4">5.2 Limitation of Liability</TypographyH3>
          <TypographyP>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE, OUR DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </TypographyP>

          <ul className="list-disc pl-6 space-y-2">
            <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE WEBSITE;</li>
            <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE WEBSITE;</li>
            <li>ANY CONTENT OBTAINED FROM THE WEBSITE; AND</li>
            <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.</li>
          </ul>
        </section>

        {/* Third-Party Services */}
        <section className="space-y-4">
          <TypographyH2>6. Third-Party Services</TypographyH2>

          <TypographyP>
            Our Website may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </TypographyP>

          <TypographyP>
            You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
          </TypographyP>

          <TypographyP>
            We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
          </TypographyP>
        </section>

        {/* Governing Law */}
        <section className="space-y-4">
          <TypographyH2>7. Governing Law</TypographyH2>

          <TypographyP>
            These Terms shall be governed and construed in accordance with the laws of the People's Republic of China, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located within China.
          </TypographyP>

          <TypographyP>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </TypographyP>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <TypographyH2>8. Contact Information</TypographyH2>

          <TypographyP>
            If you have any questions about these Terms, please contact us at
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
        </section>

        {/* Acceptance */}
        <section className="py-4 border-t border-border">
          <TypographyP className="text-center text-muted-foreground">
            By using our service, you acknowledge that you have read and understood these Terms of Use and agree to be bound by them.
          </TypographyP>
        </section>
      </Container>
    </main>
  );
}
