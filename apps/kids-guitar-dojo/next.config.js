//@ts-check
const headers = require('./config/headers');
const pluginsExtends = require('./config/plugins');

/** @type {import('next').NextConfig} **/
const nextConfig = {
  turbopack: {},
  productionBrowserSourceMaps: true,
  serverExternalPackages: [
    '@prisma/client',
    '@rocket-house-productions/prisma-client',
    'html2canvas',
    'video.js',
    'player.js',
  ],
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    serverSourceMaps: true,
    serverActions: {
      bodySizeLimit: 10 * 1024 * 1024, // 10 MB
    },
  },
  ...(process.env.NEXT_PUBLIC_PRODUCTION && headers),
  images: {
    qualities: [25, 50, 75, 90, 100],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'kids-guitar-dojo.b-cdn.net',
        port: '',
      },
    ],
  },
};

// Apply plugins directly without composePlugins/withNx
const [withBundleAnalyzer, withPWA] = pluginsExtends;
module.exports = withBundleAnalyzer(withPWA(nextConfig));