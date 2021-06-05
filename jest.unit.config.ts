import type { Config } from '@jest/types';

import config from './jest.config';

const unitTestConfig: Config.InitialOptions = {
  ...config,
  setupFiles: [...config.setupFiles, '<rootDir>/test-utils/jest-unit-setup.ts'],
};

export default unitTestConfig;
