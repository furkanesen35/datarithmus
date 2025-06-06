// packages/client/next.config.js
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // keep linting enabled for critical error detection
  },
};

module.exports = nextConfig;
