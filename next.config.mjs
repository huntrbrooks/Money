/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Many browsers still request /favicon.ico directly.
      { source: "/favicon.ico", destination: "/favicon_io/favicon.ico" },
    ]
  },
}

export default nextConfig
