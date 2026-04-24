import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
  // Wes provides org + project at deploy via SENTRY_ORG / SENTRY_PROJECT env vars.
});
