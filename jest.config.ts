import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testPathIgnorePatterns: ['<rootDir>/test-browser/'],
  setupFiles: [
    '<rootDir>/test-utils/jest-setup.ts',
    '@testing-library/react/dont-cleanup-after-each', // see https://testing-library.com/docs/react-testing-library/setup/#skipping-auto-cleanup
  ],
  rootDir: '.',
};

export default config;
