//@ts-check
const { composePlugins, withNx } = require('@nx/next');
const headers = require('./config/headers');
const pluginsExtends = require('./config/plugins');
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    // Add better module resolution
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };

    if (!dev) {
      if (isServer) {
        config.externals.push({
          html2canvas: 'commonjs html2canvas',
          'video.js': 'commonjs video.js',
          'player.js': 'commonjs player.js',
        });
        config.plugins = [...config.plugins, new PrismaPlugin()];
        config.devtool = 'source-map';
      }
    }
    return config;
  },
  productionBrowserSourceMaps: true,
  nx: {},
  serverExternalPackages: [
    '@prisma/client',
    'html2canvas',
    'video.js',
    'player.js',
    //'gsap',
  ],
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    serverSourceMaps: true,
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

/** @param nextConfig {import('next').NextConfig} */

const withNxNext16 = nextConfig => {
  if ('eslint' in nextConfig) delete nextConfig.eslint;
  return nextConfig;
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNxNext16,
  ...pluginsExtends,
];

module.exports = composePlugins(...plugins)(nextConfig);
