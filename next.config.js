/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Habilitar SSR por defecto
  reactStrictMode: true,
}

module.exports = nextConfig
