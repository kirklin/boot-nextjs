"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations("Header");
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/pricing", label: t("pricing") },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60",
      className,
    )}
    >
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 group transition-all duration-200 hover:opacity-80"
            >
              <div className="relative">
                <Image
                  src="/favicon.ico"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="rounded-md group-hover:scale-105 transition-transform duration-200"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-md bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm -z-10" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Boot Next.js
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href || (item.href === "/" && pathname === "/") ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-1">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ModeToggle />
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-4 bg-border/60 mx-2" />

            {/* Login button */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="relative overflow-hidden border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              <Link href="/sign-in" className="relative z-10">
                {t("signIn")}
              </Link>
            </Button>

            {/* Mobile menu items for smaller screens */}
            <div className="flex items-center space-x-1 sm:hidden">
              <LanguageSwitcher />
              <div className="md:hidden">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
    </header>
  );
}
