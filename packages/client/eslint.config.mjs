import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      '.next/**',
      '**/types/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
      '*.config.ts',
      '**/*.d.ts',
      '**/*.test.*',
      '**/__tests__/**',
      '**/__mocks__/**',
    ],
  },
];

export default eslintConfig;
