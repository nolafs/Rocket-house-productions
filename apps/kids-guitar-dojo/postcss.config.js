const { join } = require('path');


const safelist = [
  /html/,
  /body/,
  /^-tw-/,
  /^tw-/,
  /^maxSm:/,
  /^maxXl:/,
  /^maxLg:/,
  /^smToMd:/,
  /^sm:/,
  /^md:/,
  /^lg:/,
  /^xl:/,
  /^2xl:/,
  /^3xl:/,
  /^child:/,
  /^hover:/,
  /^focus:/,
  /^group/,
  /^group-hover:tw-/,
  /^last:/,
  /^first:/,
  /^even:/,
  /^before:/,
  /^after:/,
  /^nextIcon^/,
  /^modal-/,
  /^swiper/,
  /^react-tabs/,
];
// Note: If you use library-specific PostCSS/Tailwind configuration then you should remove the `postcssConfig` build
// option from your application's configuration (i.e. project.json)
//
// See: https://nx.dev/guides/using-tailwind-css-in-react#step-4:-applying-configuration-to-libraries

module.exports = {
  plugins: {
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
