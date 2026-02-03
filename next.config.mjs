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
      // Rewrite interactive newsletter HTML to API route
      { source: "/why-money-triggers-anxiety.html", destination: "/api/interactive-newsletter" },
    ]
  },
}

export default nextConfig
