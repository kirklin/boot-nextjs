import { ChevronLeft, Compass } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BackgroundBeams } from "~/components/background-beams";
import { Button } from "~/components/ui/button";
import { Link } from "~/lib/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6">
      <div className="absolute inset-0 h-full w-full">
        <BackgroundBeams />
      </div>
      <div className="z-10 flex max-w-md flex-col items-center text-center">
        <p className="text-8xl font-bold tracking-tighter text-primary/20 select-none">404</p>
        <h1 className="mt-4 text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href="/">
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("backHome")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/pricing">
              <Compass className="mr-1 h-4 w-4" />
              {t("explorePricing")}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
