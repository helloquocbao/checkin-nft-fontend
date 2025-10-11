/** @format */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["leaflet"],
  experimental: {
    // dùng App Router
  },
};

export default withNextIntl(nextConfig);
