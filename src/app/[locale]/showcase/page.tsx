import { ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { caseStudies } from "~/data/case-studies";

export default function ShowcasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 container px-4 mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing applications built with Boot Next.js.
            From SaaS platforms to developer tools, see what's possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map(study => (
            <Link key={study.url} href={study.url} target="_blank" className="group">
              <Card className="overflow-hidden border hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
                <div className="aspect-video relative bg-muted overflow-hidden">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors flex items-center justify-between">
                    {study.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
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

        <div className="mt-24 text-center bg-muted/30 rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">Built something with Boot Next.js?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We'd love to feature your project in our showcase. Open a pull request or let us know!
          </p>
          <Button asChild size="lg">
            <Link href="https://github.com/kirklin/boot-nextjs" target="_blank">
              Submit Your Project
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
