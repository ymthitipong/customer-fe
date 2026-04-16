/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOMER_BASE_URL: process.env.CUSTOMER_BASE_URL || 'http://localhost:8080',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/exo24_public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
