import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { REPOSITORY_URL } from "~/config/site";
import { cn } from "~/lib/utils";

/** The page's two calls to action: a filled pill and a text link. */
export function Actions({ className }: { className?: string }) {
  const t = useTranslations("HomePage.actions");

  return (
    <div className={cn("flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8", className)}>
      <a
        href={`${REPOSITORY_URL}#getting-started`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-[17px] font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:ring-4 focus-visible:ring-brand/30 focus-visible:outline-none"
      >
        {t("getStarted")}
      </a>
      <a
        href={REPOSITORY_URL}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center gap-0.5 text-[17px] text-link underline-offset-4 hover:underline"
      >
        {t("github")}
        <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
