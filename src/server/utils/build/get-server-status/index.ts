/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from 'chalk';

import { version } from '../../../../../package.json';

export const logs = {
  FAILED_TO_GET_COMMIT_HASH:
    'Failed to get commit hash for health file creation - process.env.SOURCE_VERSION not defined',
};

export function getServerStatus(): {
  version: string;
  commit: string;
} {
  const serverStatus = {
    version,
    commit: 'unknown',
  };
  // TODO: Once I get a new host, update this logic
  /* SOURCE_VERSION appears to be a Heroku-specific environment variable. A previous iteration had
  an `else` clause that ran a Node process to run 'git rev-parse HEAD', but that became very
  difficult to test, since mocking the child process also interfered with setting env variables. */

  if (process.env.SOURCE_VERSION) {
    serverStatus.commit = process.env.SOURCE_VERSION;
  } else {
    console.warn(chalk.yellow(logs.FAILED_TO_GET_COMMIT_HASH));
  }

  return serverStatus;
}
