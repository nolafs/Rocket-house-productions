//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const { composePlugins, withNx } = require('@nx/next');
const headers = require('./config/headers');
const pluginsExtends = require('./config/plugins');
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
  // https://nextjs.org/docs/advanced-features/output-file-tracing#caveats
  //...(process.env.ENVIRONMENT_NAME !== 'local' && {headers}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
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
