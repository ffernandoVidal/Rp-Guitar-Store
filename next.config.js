/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Habilitar SSR por defecto
  reactStrictMode: true,

  webpack: (config, { dev }) => {
    // En Windows a veces aparecen errores de chunks faltantes en dev
    // por cachés inconsistentes. Esto prioriza estabilidad sobre velocidad.
    if (dev) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig
