"use client";

import ISO6391 from "iso-639-1";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Link, locales, usePathname } from "~/lib/i18n/navigation";
import { cn } from "~/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-full", className)}>
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => {
          // Get language name in native language using iso-639-1
          const nativeName = ISO6391.getNativeName(locale);
          const displayName = `${nativeName} (${locale.toUpperCase()})`;

          return (
            <DropdownMenuItem key={locale} asChild>
              <Link
                href={pathname}
                locale={locale}
                className={cn(
                  "flex w-full cursor-pointer items-center px-3 py-2",
                  locale === currentLocale && "bg-accent font-semibold",
                )}
              >
                {displayName}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
