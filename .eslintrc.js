module.exports = {
  root: true,
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.wdio.json'],
  },
  ignorePatterns: [
    'public',
    'dist',
    'node_modules',
    'coverage',
    '*.json',
    '*.md',
    'test-result-screenshots',
    'scripts',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'no-void': 0, // conflicts with @typescript-eslint/no-floating-promises, which recommends using `void` for non-awaited Promises
    '@typescript-eslint/restrict-template-expressions': 0, // often used for error logs, in which the thrown object being interpolated into string is of unknown type
    'import/prefer-default-export': 0, // I disagree, named exports are easier to (1) find in codebase and (2) spy on in tests,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/logger-dev.ts',
          'wdio.conf.ts',
          'webpack.config.ts',
        ],
      },
    ],
  },
  globals: {
    wdioBaseUrl: true,
    specFilename: true,
    driver: true,
  },
};
