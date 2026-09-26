"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { HeaderShell } from "~/components/layout/header-shell";
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
import { Link } from "~/lib/i18n/navigation";

interface HeaderProps {
  className?: string;
}

const subscribeToNothing = () => () => {};

/**
 * False on the server and while hydrating. The session is only known in the
 * browser and can arrive before hydration, so it is read after this turns true.
 */
function useHydrated() {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

function AccountMenu() {
  const t = useTranslations("Header");
  const hydrated = useHydrated();
  const { data: session, isPending } = authClient.useSession();

  if (!hydrated || isPending) {
    return <div className="ml-2 size-7 animate-pulse rounded-full bg-foreground/10" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/sign-in"
        className="ml-1 rounded-full px-3 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        {t("signIn")}
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-1 size-8 rounded-full">
          <Avatar className="size-7">
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
          <Link href="/dashboard">{t("dashboard")}</Link>
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
  );
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations("Header");
  const hydrated = useHydrated();
  const { data: session } = authClient.useSession();

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/pricing", label: t("pricing") },
    ...(hydrated && session?.user ? [{ href: "/dashboard", label: t("dashboard") }] : []),
  ];

  return <HeaderShell className={className} navItems={navItems} actions={<AccountMenu />} />;
}
