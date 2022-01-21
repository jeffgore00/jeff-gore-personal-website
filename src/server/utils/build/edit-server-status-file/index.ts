/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from 'chalk';
import path from 'path';

import { getServerStatus } from '../get-server-status';
import { writeFileSync } from '../../runtime/node-wrappers';

export const PATH_TO_STATUSFILE = '../../../status.json';
export const HEALTHFILE_EDIT_SUCCESS_MESSAGE =
  'Server status successfully written to ';
export const HEALTHFILE_EDIT_ERROR_MESSAGE = 'Health file edit failed: ';
/*
As part of a production build, we want to alter the file in `dist`, not in `src`.
This file is intended for use as an npm script argument e.g.

(build server) && node -r ts-node/register src/server/utils/edit-server-status-file.ts
*/
try {
  const serverStatus = getServerStatus();
  const statusFilepath = path.join(__dirname, PATH_TO_STATUSFILE);

  writeFileSync(statusFilepath, JSON.stringify(serverStatus, null, 2));
  console.log(
    chalk.green(`${HEALTHFILE_EDIT_SUCCESS_MESSAGE}${statusFilepath}`),
  );
} catch (err) {
  console.error(chalk.red(`${HEALTHFILE_EDIT_ERROR_MESSAGE}${err}`));
}
