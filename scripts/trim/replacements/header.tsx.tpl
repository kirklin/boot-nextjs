"use client";

import { useTranslations } from "next-intl";
import { HeaderShell } from "~/components/layout/header-shell";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations("Header");

  return <HeaderShell className={className} navItems={[{ href: "/", label: t("home") }]} />;
}
