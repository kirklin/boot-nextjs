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
    <footer className={cn("mt-auto border-t border-border bg-background", className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
              Boot Next.js
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Links */}
          {footerLinks.map(group => (
            <div key={group.i18nKey} className="flex flex-col">
              <div className="text-sm font-medium mb-3">{t(`sections.${group.i18nKey}.title`)}</div>
              <ul className="space-y-2">
                {group.items.map(item => (
                  <li key={item.i18nKey}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {t(`sections.${group.i18nKey}.${item.i18nKey}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 flex justify-center">
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
    </footer>
  );
}
