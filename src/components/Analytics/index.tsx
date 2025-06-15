"use client";

import dynamic from "next/dynamic";

import { getClientConfig } from "~/config/client";

const Vercel = dynamic(() => import("./Vercel"), { ssr: false });
const Google = dynamic(() => import("./Google"), { ssr: false });

const { ANALYTICS_VERCEL, ANALYTICS_GOOGLE } = getClientConfig();

function Analytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      {ANALYTICS_VERCEL && <Vercel />}
      {ANALYTICS_GOOGLE && <Google />}
    </>
  );
}

export default Analytics;
