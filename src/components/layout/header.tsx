"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations("Header");

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm", className)}>
      <div className="container px-4 mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={24}
              height={24}
              className="rounded-sm"
            />
            <span className="font-bold text-lg md:text-xl">Boot Next.js</span>
          </Link>
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <LanguageSwitcher />
          <div className="hidden md:block mx-1">
            <ModeToggle />
          </div>

          {/* Login button */}
          <Button asChild variant="outline" size="sm" className="md:ml-2">
            <Link href="/sign-in">
              {t("signIn")}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
