import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react-hooks/incompatible-library': 'off',
    },
  },
];

export default eslintConfig;

