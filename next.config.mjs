/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/services/financial-trauma-therapy", destination: "/financial-trauma", permanent: true },
    ]
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
