// # packages/client/eslint.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Add ignores for build output, typegen files, and common patterns
  {
    ignores: [
      '.next',
      '**/types/',
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
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
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
