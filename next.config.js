const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Empty webpack hook to satisfy next-pwa (no actual changes needed)
    return config;
  },
  // Force Webpack (disable Turbopack) — fixes the conflict
  transpilePackages: [],
  // Silences the warning by providing empty Turbopack config
  turbopack: {},
};

module.exports = withPWA(nextConfig);
