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
  setupFiles: ['<rootDir>/test-utils/jest-setup.ts'],
  rootDir: '.',
  maxWorkers: '75%', // for some reason, this is required in InitialOptions
};

export default config;
