"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "~/components/language-switcher";
import { SiteMenu } from "~/components/layout/site-menu";
import { ModeToggle } from "~/components/theme-toggle";
import { Link, usePathname } from "~/lib/i18n/navigation";
import { cn } from "~/lib/utils";

interface HeaderShellProps {
  navItems: { href: string; label: string }[];
  /** Account controls at the end of the bar. */
  actions?: ReactNode;
  className?: string;
}

/**
 * The site bar: translucent and borderless, tinted with the page color
 * underneath (pages with their own background set `--page-surface`). The menu
 * unfolds from the same surface as one large card while the page behind blurs.
 */
export function HeaderShell({ navItems, actions, className }: HeaderShellProps) {
  const t = useTranslations("SiteMenu");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pointerTypeRef = useRef("");

  // A short delay keeps the card from flickering while the pointer crosses the bar.
  function hover(next: boolean) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(setOpen, next ? 80 : 180, next);
  }

  function close() {
    clearTimeout(timerRef.current);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={close}
      onPointerEnter={event => event.pointerType === "mouse" && hover(false)}
      className={cn(
        "text-[13px] transition-colors hover:text-foreground",
        pathname === href ? "text-foreground" : "text-foreground/60",
      )}
    >
      {label}
    </Link>
  );

  return (
    <header
      className={cn("sticky top-0 z-50 h-12 w-full", className)}
      onPointerLeave={event => event.pointerType === "mouse" && hover(false)}
    >
      <div
        aria-hidden
        onClick={close}
        onPointerEnter={event => event.pointerType === "mouse" && hover(false)}
        className={cn(
          "fixed inset-0 -z-10 bg-[color-mix(in_oklab,var(--page-surface,var(--background))_40%,transparent)] transition-[opacity,backdrop-filter] duration-300 dark:bg-black/50",
          open ? "opacity-100 backdrop-blur-xl" : "pointer-events-none opacity-0",
        )}
      />

      <div
        className={cn(
          "absolute inset-x-0 top-0 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300",
          // Nearly opaque while open so the card reads clean over the page.
          open
            ? "bg-[color-mix(in_oklab,var(--page-surface,var(--background))_97%,transparent)]"
            : "bg-[color-mix(in_oklab,var(--page-surface,var(--background))_80%,transparent)]",
        )}
      >
        {/* Three columns keep the links centered whatever the width of the logo and the account controls. */}
        <div className="container mx-auto grid h-12 grid-cols-[1fr_auto_1fr] items-center px-4">
          <Link href="/" onClick={close} className="flex items-center gap-2 justify-self-start transition-opacity hover:opacity-70">
            <Image src="/favicon.ico" alt="Logo" width={22} height={22} className="rounded-full" />
            <span className="text-[15px] font-semibold tracking-tight">Boot Next.js</span>
          </Link>

          <nav className="col-start-2 hidden items-center gap-8 md:flex">
            {navItems.slice(0, 1).map(({ href, label }) => navLink(href, label))}
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onPointerDown={(event) => {
                pointerTypeRef.current = event.pointerType;
              }}
              onPointerEnter={event => event.pointerType === "mouse" && hover(true)}
              onClick={(event) => {
                clearTimeout(timerRef.current);
                // A mouse has already opened it by hovering; keyboard and touch toggle it.
                const byMouse = event.detail > 0 && pointerTypeRef.current === "mouse";
                setOpen(value => byMouse || !value);
              }}
              className={cn(
                "flex items-center gap-1 text-[13px] transition-colors hover:text-foreground",
                open ? "text-foreground" : "text-foreground/60",
              )}
            >
              {t("trigger")}
              <ChevronDown className={cn("size-3 transition-transform duration-300", open && "rotate-180")} />
            </button>
            {navItems.slice(1).map(({ href, label }) => navLink(href, label))}
          </nav>

          <div className="col-start-3 flex items-center gap-0.5 justify-self-end">
            <LanguageSwitcher />
            <ModeToggle />
            {actions}
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t("close") : t("open")}
              onClick={() => setOpen(value => !value)}
              className="relative ml-1 flex size-8 items-center justify-center md:hidden"
            >
              <span className={cn("absolute h-[1.5px] w-4 rounded-full bg-foreground transition-transform duration-300", open ? "rotate-45" : "-translate-y-[3.5px]")} />
              <span className={cn("absolute h-[1.5px] w-4 rounded-full bg-foreground transition-transform duration-300", open ? "-rotate-45" : "translate-y-[3.5px]")} />
            </button>
          </div>
        </div>

        <div
          id="site-menu"
          inert={!open}
          className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="max-h-[calc(100dvh-3rem)] overflow-y-auto">
              <SiteMenu open={open} navItems={navItems} onNavigate={close} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
