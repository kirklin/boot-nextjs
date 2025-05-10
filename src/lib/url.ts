import { getClientConfig } from "~/config/client";

/**
 * 获取应用程序的基础URL
 * Get the base URL of the application
 * 根据不同的环境返回相应的URL
 * Returns the appropriate URL based on the environment
 */
export function getBaseUrl() {
  const { APP_URL } = getClientConfig();

  if (APP_URL) {
    return APP_URL;
  }

  if (
    process.env.VERCEL_ENV === "production"
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
