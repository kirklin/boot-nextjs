"use client";

import { useTranslations } from "next-intl";
import { Link } from "~/lib/i18n/navigation";
import { cn } from "~/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      i18nKey: "resources",
      items: [
        { i18nKey: "documentation", href: "https://github.com/kirklin/boot-nextjs" },
      ],
    },
    {
      i18nKey: "legal",
      items: [
        { i18nKey: "about", href: "/about-us" },
        { i18nKey: "terms", href: "/terms-of-use" },
        { i18nKey: "privacy", href: "/privacy-policy" },
      ],
    },
    {
      i18nKey: "social",
      items: [
        { i18nKey: "github", href: "https://github.com/kirklin/boot-nextjs" },
      ],
    },
  ];

  return (
    <footer className={cn(
      "mt-auto relative border-t border-border/60 bg-gradient-to-b from-background to-muted/20",
      className,
    )}
    >
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-xl mb-6 group transition-all duration-200 hover:opacity-80"
            >
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Boot Next.js
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Links */}
          {footerLinks.map(group => (
            <div key={group.i18nKey} className="flex flex-col space-y-4">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                {t(`sections.${group.i18nKey}.title`)}
              </h3>
              <ul className="space-y-3">
                {group.items.map(item => (
                  <li key={item.i18nKey}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block relative group"
                    >
                      <span className="relative z-10">
                        {t(`sections.${group.i18nKey}.${item.i18nKey}`)}
                      </span>
                      {/* Subtle underline effect */}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              &copy;
              {" "}
              {currentYear}
              {" "}
              Boot Next.js.
              {" "}
              {t("allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
