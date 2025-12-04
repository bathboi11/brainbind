const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions enabled by default in Next.js 14 — no experimental flag needed
  // Turbopack not supported in 14 — no config needed
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Empty hook for next-pwa compatibility
    return config;
  },
};

module.exports = withPWA(nextConfig);
