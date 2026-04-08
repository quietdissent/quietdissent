import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/quiz",
        destination: "https://qd-quiz.vercel.app",
      },
      {
        source: "/quiz/:path*",
        destination: "https://qd-quiz.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;
