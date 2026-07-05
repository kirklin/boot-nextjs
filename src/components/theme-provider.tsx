"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

// next-themes injects an inline <script> to set the theme before first paint.
// React 19 logs a dev-only false-positive warning for it ("Encountered a
// script tag while rendering React component") whenever the tree renders on
// the client, e.g. on the 404 page. next-themes is effectively unmaintained
// (no release since 2025-03), so filter that exact message in development.
// https://github.com/pacocoursey/next-themes/issues/387
const FILTER_FLAG = Symbol.for("boot-nextjs.themeScriptWarningFiltered");

if (
  typeof window !== "undefined"
  && process.env.NODE_ENV === "development"
  && !(console.error as any)[FILTER_FLAG]
) {
  const originalError = console.error;
  const filteredError = (...args: unknown[]) => {
    if (
      typeof args[0] === "string"
      && args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
  (filteredError as any)[FILTER_FLAG] = true;
  console.error = filteredError;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
