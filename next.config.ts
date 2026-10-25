import type { NextConfig } from "next";

console.info(`YuppiFacts web Node.js runtime ${process.version}`);

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
