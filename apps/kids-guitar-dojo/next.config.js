//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const headers = require('./config/headers');
const pluginsExtends = require('./config/plugins');
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      if (isServer) {
        config.externals.push({ html2canvas: 'commonjs html2canvas', 'video.js': 'commonjs video.js' });
        config.plugins = [...config.plugins, new PrismaPlugin()];
        config.devtool = 'source-map';
      }
    }

    return config;
  },
  productionBrowserSourceMaps: true,
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  serverExternalPackages: [
    '@prisma/client',
    'html2canvas',
    'video.js',
    '@react-three/fiber',
    '@react-three/drei',
    'gsap',
  ],
  transpilePackages: ['three'],
  experimental: {
    taint: true,
    serverSourceMaps: true,
  },
  ...(process.env.NEXT_PUBLIC_PRODUCTION && headers),
  images: {
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

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  ...pluginsExtends,
];

module.exports = composePlugins(...plugins)(nextConfig);
