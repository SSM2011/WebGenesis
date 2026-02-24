import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // IMPORTANT for Docker
  // output: "standalone",
};

export default nextConfig;