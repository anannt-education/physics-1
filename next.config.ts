import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  // Next 16 treats 127.0.0.1 and localhost as different origins and blocks
  // /_next hydration + HMR unless the request host is allowlisted.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
