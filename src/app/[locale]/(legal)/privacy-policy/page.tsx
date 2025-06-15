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
    title: "Privacy Policy | boot-nextjs",
    description: "Privacy Policy for boot-nextjs - Learn how we handle your data. We prioritize your privacy and data security.",
    alternates: createAlternates("/privacy-policy", locale),
  };
}

export default function PrivacyPolicyPage() {
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
            <span>Privacy Policy</span>
          </div>

          <TypographyH1>Privacy Policy</TypographyH1>
          <TypographyLead>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
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
            boot-nextjs ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy applies to information we collect when you use our website at
            {" "}
            {/* TODO: Replace with your own domain */}
            <Link href="/" className="text-primary hover:underline">
              example.com
            </Link>
            {" "}
            ("Website") and the services available through our Website (collectively, the "Services").
          </TypographyP>

          <TypographyP>
            By accessing or using our Services, you indicate that you have read, understood, and agree to our collection, storage, use, and disclosure of your information as described in this Privacy Policy.
          </TypographyP>
        </section>

        {/* Information We Collect */}
        <section className="space-y-4">
          <TypographyH2>1. Information We Collect</TypographyH2>

          <TypographyH3 className="mt-4">1.1 Information You Provide to Us</TypographyH3>
          <TypographyP>
            We do not require you to create an account or provide personal information to use our Services. The content you input into our tools (such as Markdown text) is processed entirely within your browser and is not stored on our servers.
          </TypographyP>

          <TypographyH3 className="mt-4">1.2 Information We Collect Automatically</TypographyH3>
          <TypographyP>
            When you access or use our Services, we may automatically collect certain information about your device and usage of the Services, including:
          </TypographyP>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Device Information</strong>
              : We may collect device information such as your operating system, browser type, browser version, and other technologies on the devices you use to access the Services.
            </li>
            <li>
              <strong>Usage Information</strong>
              : We collect information about your usage of the Services, such as the pages or features you access, the links you click, and the time spent on our Website.
            </li>
            <li>
              <strong>Log Information</strong>
              : Our servers automatically record information created by your use of the Services, including your IP address and browser type.
            </li>
          </ul>

          <TypographyH3 className="mt-4">1.3 Cookies and Similar Technologies</TypographyH3>
          <TypographyP>
            We use cookies and similar tracking technologies to track activity on our Services and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
          </TypographyP>
          <TypographyP>
            The types of cookies we use include:
          </TypographyP>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential Cookies</strong>
              : These cookies are necessary for the Website to function properly and cannot be switched off in our systems.
            </li>
            <li>
              <strong>Analytics Cookies</strong>
              : These help us understand how visitors interact with our Website by collecting and reporting information anonymously.
            </li>
            <li>
              <strong>Advertising Cookies</strong>
              : These cookies may be set through our Website by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other websites.
            </li>
          </ul>
          <TypographyP>
            Most web browsers are set to accept cookies by default. You can typically remove or reject cookies through your browser settings. Please note that removing or rejecting cookies could affect the availability and functionality of our Services.
          </TypographyP>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-4">
          <TypographyH2>2. How We Use Your Information</TypographyH2>

          <TypographyP>
            We use the information we collect primarily to provide, maintain, and improve our Services. More specifically, we use your information to:
          </TypographyP>

          <ul className="list-disc pl-6 space-y-2">
            <li>Operate and maintain our Services;</li>
            <li>Understand how users interact with our Services, and analyze usage patterns to improve our Services;</li>
            <li>Detect, prevent, and address technical issues;</li>
            <li>Develop new products, services, features, and functionality;</li>
            <li>Display relevant advertisements to support our free services.</li>
          </ul>
        </section>

        {/* Sharing of Information */}
        <section className="space-y-4">
          <TypographyH2>3. Sharing of Information</TypographyH2>

          <TypographyP>
            We do not sell, trade, or otherwise transfer your information to third parties for marketing purposes. We may share your information with third parties in the following circumstances:
          </TypographyP>

          <TypographyH3 className="mt-4">3.1 Service Providers</TypographyH3>
          <TypographyP>
            We may share your information with third-party vendors, service providers, contractors, or agents who perform services on our behalf, including:
          </TypographyP>
          <ul className="list-disc pl-6 space-y-2">
            <li>Analytics providers (such as Google Analytics);</li>
            <li>Advertising partners (such as Google AdSense).</li>
          </ul>

          <TypographyH3 className="mt-4">3.2 Legal Requirements</TypographyH3>
          <TypographyP>
            We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
          </TypographyP>

          <TypographyH3 className="mt-4">3.3 Protection of Rights</TypographyH3>
          <TypographyP>
            We may disclose your information when we believe disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
          </TypographyP>
        </section>

        {/* Third-Party Services */}
        <section className="space-y-4">
          <TypographyH2>4. Third-Party Services</TypographyH2>

          <TypographyH3 className="mt-4">4.1 Google Analytics</TypographyH3>
          <TypographyP>
            We use Google Analytics to help analyze how users use our Website. Google Analytics uses cookies to collect information such as how often users visit the Website, what pages they visit, and what other sites they used prior to coming to our Website. We use the information to compile reports and to help us improve the Website.
          </TypographyP>
          <TypographyP>
            For more information about how Google Analytics collects and processes data, please visit
            {" "}
            <a
              href="https://www.google.com/policies/privacy/partners/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              "How Google uses data when you use our partners' sites or apps."
            </a>
          </TypographyP>
          <TypographyP>
            You can opt-out of Google Analytics by installing the
            {" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </TypographyP>

          <TypographyH3 className="mt-4">4.2 Google AdSense</TypographyH3>
          <TypographyP>
            We use Google AdSense to display advertisements on our Website. Google AdSense may use cookies and web beacons to collect information about your visits to this and other websites to provide you with relevant advertisements.
          </TypographyP>
          <TypographyP>
            Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our Website and/or other sites on the Internet. You may opt out of personalized advertising by visiting
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

        {/* Data Security */}
        <section className="space-y-4">
          <TypographyH2>5. Data Security</TypographyH2>

          <TypographyP>
            We have implemented appropriate technical and organizational measures designed to protect the security of any personal information we process. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
          </TypographyP>

          <TypographyP>
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
          </TypographyP>
        </section>

        {/* Client-Side Processing */}
        <section className="space-y-4">
          <TypographyH2>6. Client-Side Processing</TypographyH2>

          <TypographyP>
            All content processing (such as Markdown rendering, word counting, and other conversions) happens entirely within your browser. The data you input into our tools is processed locally on your device and is not transmitted to or stored on our servers.
          </TypographyP>

          <TypographyP>
            This client-side processing approach means:
          </TypographyP>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your content remains private and is never sent to our servers;</li>
            <li>You can use our tools even when offline (once the page has loaded);</li>
            <li>Processing speed depends on your device's capabilities rather than server response times.</li>
          </ul>
        </section>

        {/* Children's Privacy */}
        <section className="space-y-4">
          <TypographyH2>7. Children's Privacy</TypographyH2>

          <TypographyP>
            Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
          </TypographyP>
        </section>

        {/* Changes to This Privacy Policy */}
        <section className="space-y-4">
          <TypographyH2>8. Changes to This Privacy Policy</TypographyH2>

          <TypographyP>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page.
          </TypographyP>

          <TypographyP>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </TypographyP>
        </section>

        {/* Your Rights */}
        <section className="space-y-4">
          <TypographyH2>9. Your Rights</TypographyH2>

          <TypographyP>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </TypographyP>

          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access personal information we hold about you;</li>
            <li>The right to request that we correct any inaccurate or incomplete personal information;</li>
            <li>The right to request that we delete your personal information;</li>
            <li>The right to object to or restrict the processing of your personal information;</li>
            <li>The right to data portability (receiving a copy of your personal information in a structured, commonly used format);</li>
            <li>The right to withdraw consent at any time, where we rely on your consent to process your personal information.</li>
          </ul>

          <TypographyP>
            Please note that many of these rights may not apply to our Services since we do not collect or store personally identifiable information through our tools.
          </TypographyP>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <TypographyH2>10. Contact Information</TypographyH2>

          <TypographyP>
            If you have any questions about this Privacy Policy, please contact us at
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
            By using our service, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </TypographyP>
        </section>
      </Container>
    </main>
  );
}
