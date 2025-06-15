import type { Metadata } from "next";
import { getBaseUrl } from "~/lib/url";

/**
 * 创建通用网站JSON-LD结构化数据
 * @param baseUrl 网站的基础URL
 */
export function createWebsiteJsonLd(baseUrl: string = getBaseUrl()) {
  // TODO: Replace with your site name
  const siteName = "boot-nextjs";
  const siteUrl = baseUrl;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    // TODO: Replace with your site description
    "description": "A Next.js boilerplate.",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    "image": `${siteUrl}/logo_1024x1024.png`,
    "aggregateRating": {
      "@type": "AggregateRating",
      // TODO: Replace with your own rating
      "ratingValue": "5",
      "ratingCount": "1",
      "itemReviewed": {
        "@type": "WebApplication",
        "name": siteName,
        "url": siteUrl,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
      },
    },
  };
}

/**
 * 创建FAQPage类型的JSON-LD
 * @param faqs 常见问题和答案的数组
 */
export function createFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

/**
 * 创建Article类型的JSON-LD
 * @param metadata 页面的元数据
 * @param path 文章URL路径
 * @param datePublished 发布日期
 * @param dateModified 最后修改日期
 * @param authorName 作者名称
 * @param authorUrl 作者URL
 * @param baseUrl 网站基础URL
 */
export function createArticleJsonLd(
  metadata: Metadata,
  path: string,
  datePublished: string,
  dateModified: string = datePublished,
  // TODO: Replace with your own author name
  authorName: string = "boot-nextjs Team",
  authorUrl: string = getBaseUrl(),
  baseUrl: string = getBaseUrl(),
) {
  // 从元数据中提取信息
  const title = typeof metadata.title === "string" ? metadata.title : "";
  const description = typeof metadata.description === "string" ? metadata.description : "";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title.split("|")[0].trim(),
    "description": description,
    "image": `${baseUrl}/logo_1024x1024.png`,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl,
    },
    "publisher": {
      "@type": "Organization",
      // TODO: Replace with your own organization name
      "name": "boot-nextjs",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo_512x512.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}${path}`,
    },
  };
}

/**
 * 创建Organization类型的JSON-LD
 * @param baseUrl 网站的基础URL
 */
export function createOrganizationJsonLd(baseUrl: string = getBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    // TODO: Replace with your own organization name
    "name": "boot-nextjs",
    "url": baseUrl,
    "logo": `${baseUrl}/logo_512x512.png`,
    // TODO: Replace with your own organization description
    "description": "A Next.js boilerplate.",
    "sameAs": [
      // TODO: Replace with your own social links
      "https://github.com/example/boot-nextjs",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      // TODO: Replace with your own email
      "email": "support@example.com",
    },
    "founder": {
      "@type": "Person",
      // TODO: Replace with your own founder info
      "name": "Your Name",
      "url": "https://github.com/example",
    },
  };
}
