/**
 * the client config is only used in Vercel deployment
 */

import { z } from "zod";

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_ANALYTICS_VERCEL?: string;
      NEXT_PUBLIC_VERCEL_DEBUG?: string;

      NEXT_PUBLIC_DEVELOPER_DEBUG: string;
    }
  }
}

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_VERCEL: z.string().optional().default("0"),
  NEXT_PUBLIC_VERCEL_DEBUG: z.string().optional().default("0"),
  NEXT_PUBLIC_DEVELOPER_DEBUG: z.string().optional().default("0"),
});

export function getClientConfig() {
  const parsedEnv = envSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ANALYTICS_VERCEL: process.env.NEXT_PUBLIC_ANALYTICS_VERCEL,
    NEXT_PUBLIC_VERCEL_DEBUG: process.env.NEXT_PUBLIC_VERCEL_DEBUG,
    NEXT_PUBLIC_DEVELOPER_DEBUG: process.env.NEXT_PUBLIC_DEVELOPER_DEBUG,
  });
  return {
    APP_URL: parsedEnv.NEXT_PUBLIC_APP_URL,
    // Vercel Analytics
    ANALYTICS_VERCEL: parsedEnv.NEXT_PUBLIC_ANALYTICS_VERCEL === "1",
    VERCEL_DEBUG: parsedEnv.NEXT_PUBLIC_VERCEL_DEBUG === "1",

    // developer debug mode
    DEBUG_MODE: parsedEnv.NEXT_PUBLIC_DEVELOPER_DEBUG === "1",
  };
}
