import type { NextConfig } from "next";

/**
 * Static export: the site is deployed as plain files on the existing nginx host,
 * next to the existing PHP mailer at /mailserver/server.php that the contact form posts to.
 * `trailingSlash` emits /gallery/index.html so the current URLs keep working.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
