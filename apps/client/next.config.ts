import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@app/server", "@app/constants"],
};

export default nextConfig;
