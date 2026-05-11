/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone-Output für Docker/Coolify – minimaler self-contained Server
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Transpile ESM/CJS mixed packages so webpack bundles them correctly
  transpilePackages: ['react-leaflet-cluster'],
};

module.exports = nextConfig;
