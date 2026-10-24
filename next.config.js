/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: '/founder-akatech/projets/:slug', destination: '/founder-akatech/index.html' }]
  },
}

export default nextConfig
