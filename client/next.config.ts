import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    config.resolve.extensions?.push(".ts", ".tsx");
    config.resolve.modules = [path.resolve(__dirname), "node_modules"];
    return config;
  },
};

export default nextConfig;
