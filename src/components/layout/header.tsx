"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeToggle } from "~/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authClient } from "~/lib/auth/client";
import { Link, usePathname } from "~/lib/i18n/navigation";
import { cn } from "~/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/pricing", label: t("pricing") },
    ...(session?.user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
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

            {/* Show user profile or login button based on auth state */}
            {isPending
              ? (
                // Show loading state while checking auth
                  <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                )
              : session?.user
                ? (
                  // User is logged in - show profile dropdown
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                            <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/profile">{t("profile")}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async () => {
                            await authClient.signOut();
                          }}
                        >
                          {t("signOut")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                : (
                  // User is not logged in - show login button
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
                  )}

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
