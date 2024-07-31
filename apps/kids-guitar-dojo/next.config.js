const { composePlugins, withNx } = require('@nx/next');
const headers = require('./config/headers');
const pluginsExtends = require('./config/plugins');
const path = require('path');
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  output: 'standalone',
  //...(process.env.ENVIRONMENT_NAME !== 'local' && { headers }),
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
      },
    ],
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  //...pluginsExtends,
];

module.exports = composePlugins(...plugins)(nextConfig);
