import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
