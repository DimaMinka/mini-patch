import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',                // Generate static HTML/CSS/JS into /out
  basePath: '/mini-patch',         // Matches GitHub Pages URL: dimaminka.github.io/mini-patch
  images: { unoptimized: true },   // Required for static export (no server for optimization)
};

export default nextConfig;
