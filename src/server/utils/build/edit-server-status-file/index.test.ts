import path from 'path';

const sampleError = new Error('write failure');
const sampleServerStatus = {
  commit: 'abcdefg',
  version: '99.99.99',
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

    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
      const getServerStatusModule = require('../get-server-status');
      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const logger = require('../../runtime/logger').default;

      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
      const writeFileSyncModule = require('../../runtime/node-wrappers');

      jest
        .spyOn(getServerStatusModule, 'getServerStatus')
        .mockImplementation(() => sampleServerStatus);
      errorLoggerSpy = jest
        .spyOn(logger, 'error')
        .mockImplementation(() => null);
      writeFileSpy = jest
        .spyOn(writeFileSyncModule, 'writeFileSync')
        .mockImplementationOnce(() => {
          throw sampleError;
        });

      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment
      module = require('.');
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
