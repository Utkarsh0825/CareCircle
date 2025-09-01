/** @type {import('next').NextConfig} */
const nextConfig = {
  // Completely disable dev indicators and tools
  devIndicators: false,
  // Disable all development overlays and prompts
  experimental: {
    // Disable React strict mode warnings
    strictMode: false,
    // Disable all development features
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Disable webpack analysis
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable webpack analysis in development
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
    }
    return config
  },
  // Disable all development features
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
