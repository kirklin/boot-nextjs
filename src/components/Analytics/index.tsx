"use client";

import dynamic from "next/dynamic";

import { getClientConfig } from "~/config/client";

const Vercel = dynamic(() => import("./Vercel"), { ssr: false });

const { ANALYTICS_VERCEL } = getClientConfig();

function Analytics() {
  return (
    <>
      {ANALYTICS_VERCEL && <Vercel />}
    </>
  );
}

export default Analytics;
