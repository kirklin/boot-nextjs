import type { NextRequest } from "next/server";
import { defaultLocale } from "~/lib/i18n/navigation";
import { getBaseUrl } from "~/lib/url";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  const isDefaultLocale = locale === defaultLocale;
  const currentDate = new Date();

  // 定义网站路由
  const routes = [
    { path: "", priority: 1 },
  ];

  // 为特定语言生成站点地图
  const sitemapEntries = routes.map((route) => {
    let url;
    const path = route.path.replace(/^\/+/, "");

    if (isDefaultLocale) {
      // 默认语言路径
      url = path ? `${baseUrl}/${path}` : baseUrl;
    } else {
      // 非默认语言路径
      url = path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;
    }

    return {
      url,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    };
  });

  // 返回XML格式的站点地图
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    },
  );
}
