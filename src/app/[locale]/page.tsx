import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { use } from "react";

import { ModeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations("HomePage");

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* 主题切换按钮 */}
      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
          {t("title")}
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 mb-8">
          {t("description")}
        </p>
        <Button
          asChild
          size="lg"
          variant="default"
          className="rounded-full font-medium text-lg"
        >
          <Link
            href="https://github.com/kirklin/boot-nextjs"
            target="_blank"
          >
            {t("getStarted")}
          </Link>
        </Button>
      </div>
    </main>
  );
}
