"use server";

import { headers } from "next/headers";

/**
 * Get the client's real IP address
 *
 * Retrieves IP address with the following priority:
 * 1. cf-connecting-ip - Client IP from Cloudflare proxy
 * 2. x-real-ip - Client IP from Vercel or other reverse proxies
 * 3. x-forwarded-for - Standard proxy header containing client and intermediate proxy IPs
 *
 * Returns an empty string if no IP address can be obtained
 *
 * @returns {Promise<string>} Client IP address or empty string
 */
export async function getClientIp() {
  const h = await headers();

  const ip
    = h.get("cf-connecting-ip") // Client IP from Cloudflare proxy
      || h.get("x-real-ip") // Client IP from Vercel or other reverse proxies
      || (h.get("x-forwarded-for") || "").split(",")[0].trim(); // Standard proxy header, get the first IP

  return ip || "";
}
