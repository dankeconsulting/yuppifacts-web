import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  turbopack: { root: process.cwd() },
  async rewrites() {
    return [
      {
        source: "/local-api/:path*",
        destination: "https://yuppifacts-api.onrender.com/:path*"
      }
    ];
  }
};
export default nextConfig;
