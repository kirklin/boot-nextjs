"use client";

import { useAmp } from "next/amp";
import Script from "next/script";
import * as React from "react";

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

/**
 * JSON-LD结构化数据组件
 * 用于向页面注入JSON-LD格式的结构化数据，帮助搜索引擎更好地理解页面内容
 */
export function JsonLd({ data }: JsonLdProps) {
  const isAmp = useAmp();
  // 将数据转换为JSON字符串
  const jsonLdData = JSON.stringify(data);

  if (isAmp) {
    return (

      <script
        type="application/ld+json"
        // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: jsonLdData }}
        key="jsonld-data"
      />
    );
  }

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: jsonLdData }}
      strategy="afterInteractive"
    />
  );
}
