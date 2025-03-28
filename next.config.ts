import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["https://www.linkedin.com"],
      bodySizeLimit: "1mb",
    },
  },
};

export default nextConfig;
