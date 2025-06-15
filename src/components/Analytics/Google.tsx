"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { memo } from "react";

import { getClientConfig } from "~/config/client";

const { GOOGLE_ANALYTICS_ID } = getClientConfig();

const GoogleAnalytics = memo(() => {
  if (!GOOGLE_ANALYTICS_ID) {
    return null;
  }

  return <NextGoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />;
});

export default GoogleAnalytics;
