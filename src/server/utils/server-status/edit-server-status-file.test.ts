import fs from 'fs';
import path from 'path';

import * as getServerStatusModule from './get-server-status';
import logger from '../logger';

const sampleError = new Error('write failure');
const sampleServerStatus = {
  commit: 'unknown',
  version: '1.0.0',
};

interface Constants {
  [key: string]: string;
}

describe('Edit server status file', () => {
  let errorLoggerSpy: jest.SpyInstance;
  let writeFileSpy: jest.SpyInstance;
  let module: Constants;

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(getServerStatusModule, 'getServerStatus')
      .mockImplementation(() => sampleServerStatus);
    errorLoggerSpy = jest.spyOn(logger, 'error').mockImplementation(() => null);
    writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw sampleError;
    });
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment
      module = require('./edit-server-status-file');
    });
  });

  it('attempts to write the server status to /dist/server/status.json', () => {
    expect(writeFileSpy).toHaveBeenCalledWith(
      path.join(__dirname, module.PATH_TO_STATUSFILE),
      JSON.stringify(sampleServerStatus, null, 2),
    );
  });

  describe('when theres an error', () => {
    it('logs the error', () => {
      expect(errorLoggerSpy).toHaveBeenCalledWith(
        `${module.HEALTHFILE_EDIT_ERROR_MESSAGE}${sampleError}`,
      );
    });
  });
});
