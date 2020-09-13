import fs from 'fs';
import path from 'path';

import { getServerStatus } from './get-server-status';
import logger from '../logger';

export const PATH_TO_STATUSFILE = '../../status.json';
export const HEALTHFILE_EDIT_ERROR_MESSAGE = 'Health file edit failed: ';
/*
As part of a production build, we want to alter the file in `dist`, not in `src`.
This file is intended for use as an npm script argument e.g.

(build server) && node -r ts-node/register src/server/utils/edit-server-status-file.ts
*/
try {
  const serverStatus = getServerStatus();
  fs.writeFileSync(
    path.join(__dirname, PATH_TO_STATUSFILE),
    JSON.stringify(serverStatus, null, 2),
  );
} catch (err) {
  logger.error(`${HEALTHFILE_EDIT_ERROR_MESSAGE}${err}`);
}
