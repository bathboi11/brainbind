import { withPWA } from '@ducanh2912/next-pwa';

const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

export default withPWA(nextConfig)({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});
