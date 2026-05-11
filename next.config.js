/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone-Output für Docker/Coolify – minimaler self-contained Server
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Transpile ESM-only packages so webpack bundles them correctly
  transpilePackages: ['react-leaflet', '@react-leaflet/core'],
};

module.exports = nextConfig;
