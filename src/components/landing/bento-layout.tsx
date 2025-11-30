"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "~/lib/i18n/navigation";
import { cn } from "~/lib/utils";

interface BentoLayoutProps {
  features: {
    icon: ReactNode;
    title: string;
    description: string;
  }[];
  caseStudies: {
    title: string;
    description: string;
    image: string;
    url: string;
    tags: string[];
  }[];
}

export function BentoLayout({ features, caseStudies }: BentoLayoutProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (caseStudies.length <= 1) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % caseStudies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [caseStudies.length]);

  const currentStudy = caseStudies[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="h-full w-full p-4 overflow-hidden relative bg-background">
      <motion.div
        className="grid grid-cols-12 grid-rows-12 gap-4 h-full w-full max-w-[1600px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Hero Section - Top Left - Large */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 row-span-6 lg:row-span-8">
          <Card className="h-full relative overflow-hidden border-border bg-card/50 hover:bg-card/80 transition-colors duration-300 shadow-sm">
            <CardContent className="h-full flex flex-col justify-center p-8 lg:p-12 relative z-10">
              <Badge variant="outline" className="w-fit mb-6 px-4 py-1.5 text-sm rounded-full border-primary/20 bg-primary/5 text-primary">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Next.js 16 + TypeScript + Tailwind CSS</span>
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight text-foreground">
                Build AI SaaS
                <br />
                <span className="text-primary">
                  Faster Than Ever
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                The ultimate starter kit for your next big idea. Authentication, payments, internationalization, and AI integration ready to go.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full h-12 px-8 text-base shadow-sm hover:shadow-md transition-all duration-300">
                  <Link href="https://github.com/kirklin/boot-nextjs" target="_blank">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="rounded-full h-12 px-8 text-base hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <Link href="https://github.com/kirklin/boot-nextjs" target="_blank">
                    <Github className="mr-2 h-5 w-5" />
                    Star on GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 1 - Top Right */}
        <motion.div variants={itemVariants} className="col-span-6 lg:col-span-4 row-span-6 lg:row-span-4">
          <Card className="h-full bg-card/50 hover:bg-card/80 transition-colors duration-300 border-border shadow-sm">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-xl w-fit text-primary mb-2">
                {features[0].icon}
              </div>
              <CardTitle className="text-xl text-foreground">{features[0].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-muted-foreground">{features[0].description}</CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 2 - Middle Right */}
        <motion.div variants={itemVariants} className="col-span-6 lg:col-span-4 row-span-6 lg:row-span-4">
          <Card className="h-full bg-card/50 hover:bg-card/80 transition-colors duration-300 border-border shadow-sm">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-xl w-fit text-primary mb-2">
                {features[1].icon}
              </div>
              <CardTitle className="text-xl text-foreground">{features[1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-muted-foreground">{features[1].description}</CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        {/* Case Study / Showcase - Bottom Left */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 row-span-6 lg:row-span-4">
          <Link
            href="/showcase"
            className="h-full w-full overflow-hidden group relative border border-border rounded-xl block shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Background Image */}
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
              <Image
                key={currentStudy.image}
                src={currentStudy.image}
                alt={currentStudy.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
            </div>

            <CardContent className="relative z-20 h-full flex flex-col justify-end p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-sm">
                  Case Study
                </Badge>
                {caseStudies.length > 1 && (
                  <div className="flex gap-1.5">
                    {caseStudies.map((study, idx) => (
                      <div
                        key={study.title}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          idx === currentIndex ? "bg-white w-3" : "bg-white/40",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{currentStudy.title}</h3>
              <p className="text-white/80 text-sm line-clamp-2 mb-3">{currentStudy.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {currentStudy.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-white/90 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Link>
        </motion.div>

        {/* Feature 3 - Bottom Middle */}
        <motion.div variants={itemVariants} className="col-span-6 lg:col-span-4 row-span-6 lg:row-span-4">
          <Card className="h-full bg-card/50 hover:bg-card/80 transition-colors duration-300 border-border shadow-sm">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-xl w-fit text-primary mb-2">
                {features[2].icon}
              </div>
              <CardTitle className="text-xl text-foreground">{features[2].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-muted-foreground">{features[2].description}</CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        {/* More Features / CTA - Bottom Right */}
        <motion.div variants={itemVariants} className="col-span-6 lg:col-span-4 row-span-6 lg:row-span-4">
          <Card className="h-full bg-primary text-primary-foreground border-none relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="h-full flex flex-col justify-between p-6 relative z-10">
              <div>
                <CardTitle className="text-2xl mb-2">Ready to ship?</CardTitle>
                <CardDescription className="text-primary-foreground/90">
                  Get the complete starter kit today.
                </CardDescription>
              </div>
              <Button variant="secondary" className="w-full rounded-full group-hover:bg-background group-hover:text-foreground transition-all duration-300">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
