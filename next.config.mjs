/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure compatibility with React 18
  reactStrictMode: false,
  // Disable all development overlays and prompts
  experimental: {
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
