import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { use } from "react";

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
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 z-0" />

      {/* 内容区域 */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-8">
          {t("description")}
        </p>
        <Link
          href="https://github.com/kirklin/boot-nextjs"
          target="_blank"
          className="inline-flex items-center bg-white text-slate-900 hover:bg-white/90 transition-colors px-8 py-3 rounded-full font-medium text-lg"
        >
          {t("getStarted")}
        </Link>
      </div>
    </main>
  );
}
