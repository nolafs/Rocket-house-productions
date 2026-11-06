import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react-hooks/incompatible-library': 'off',
      // Newly-enabled by the eslint-config-next upgrade; downgraded to warn since it
      // flags several existing, intentional effect patterns across the codebase that
      // need a dedicated review rather than a drive-by fix during a dependency bump.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default eslintConfig;

