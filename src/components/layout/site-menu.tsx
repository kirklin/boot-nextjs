"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { REPOSITORY_URL } from "~/config/site";
import { Link } from "~/lib/i18n/navigation";
import { cn } from "~/lib/utils";

interface MenuLink {
  key: string;
  href: string;
}

// Sample content. One entry per line, so `pnpm trim` can drop the links of removed features.
const EXPLORE: MenuLink[] = [
  { key: "ai", href: "/#ai" },
  { key: "auth", href: "/#auth" },
  { key: "billing", href: "/#payments" },
  { key: "dashboard", href: "/#dashboard" },
  { key: "i18n", href: "/#i18n" },
  { key: "theming", href: "/#theming" },
];

const GET_STARTED: MenuLink[] = [
  { key: "docs", href: `${REPOSITORY_URL}#getting-started` },
  { key: "clone", href: REPOSITORY_URL },
  { key: "trim", href: `${REPOSITORY_URL}#trim-the-template` },
  { key: "deploy", href: `https://vercel.com/new/clone?repository-url=${encodeURIComponent(REPOSITORY_URL)}` },
];

const RESOURCES: MenuLink[] = [
  { key: "pricing", href: "/pricing" },
  { key: "showcase", href: "/showcase" },
  { key: "about", href: "/about-us" },
  { key: "privacy", href: "/privacy-policy" },
];

interface MenuAnchorProps {
  href: string;
  className: string;
  onNavigate: () => void;
  children: ReactNode;
}

function MenuAnchor({ href, className, onNavigate, children }: MenuAnchorProps) {
  if (href.startsWith("http")) {
    return <a href={href} target="_blank" rel="noreferrer" className={className} onClick={onNavigate}>{children}</a>;
  }
  return <Link href={href} className={className} onClick={onNavigate}>{children}</Link>;
}

const bigLink = "text-2xl font-semibold tracking-tight transition-colors hover:text-foreground/60";
const smallLink = "text-[13px] font-medium text-foreground/80 transition-colors hover:text-foreground";

interface SiteMenuProps {
  open: boolean;
  /** The bar's own links, repeated here for small screens where the bar hides them. */
  navItems: { href: string; label: string }[];
  onNavigate: () => void;
}

/** The large card that unfolds under the site bar. Columns fade in one after another. */
export function SiteMenu({ open, navItems, onNavigate }: SiteMenuProps) {
  const t = useTranslations("SiteMenu");
  const column = (delay: string) => cn(
    "transition duration-300 ease-out",
    open ? ["translate-y-0 opacity-100", delay] : "-translate-y-1.5 opacity-0",
  );
  const smallColumn = (title: string, links: MenuLink[], delay: string) => (
    <div className={column(delay)}>
      <p className="text-xs text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {links.map(({ key, href }) => (
          <li key={key}>
            <MenuAnchor href={href} className={smallLink} onNavigate={onNavigate}>{t(key)}</MenuAnchor>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 pt-6 pb-12 md:flex-row md:gap-16 md:pt-9 md:pb-14">
      <ul className={cn("space-y-1 md:hidden", column("delay-50"))}>
        {navItems.map(({ href, label }) => (
          <li key={href}>
            <MenuAnchor href={href} className={bigLink} onNavigate={onNavigate}>{label}</MenuAnchor>
          </li>
        ))}
      </ul>
      <div className={column("delay-75")}>
        <p className="text-xs text-muted-foreground">{t("explore")}</p>
        <ul className="mt-3 space-y-1">
          {EXPLORE.map(({ key, href }) => (
            <li key={key}>
              <MenuAnchor href={href} className={bigLink} onNavigate={onNavigate}>{t(key)}</MenuAnchor>
            </li>
          ))}
        </ul>
        <MenuAnchor href="/#features" className={cn("mt-5 inline-block", smallLink)} onNavigate={onNavigate}>
          {t("allFeatures")}
        </MenuAnchor>
      </div>
      {smallColumn(t("getStarted"), GET_STARTED, "delay-100")}
      {smallColumn(t("resources"), RESOURCES, "delay-150")}
    </div>
  );
}
