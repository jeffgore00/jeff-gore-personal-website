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
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let writeFileSpy: jest.SpyInstance;
  let module: Constants;
  let writeSuccess = true;
  let expectedFilepath: string;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
      const getServerStatusModule = require('../get-server-status');
      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
      const writeFileSyncModule = require('../../runtime/node-wrappers');

      jest
        .spyOn(getServerStatusModule, 'getServerStatus')
        .mockImplementation(() => sampleServerStatus);
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => null);
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => null);
      writeFileSpy = jest
        .spyOn(writeFileSyncModule, 'writeFileSync')
        .mockImplementationOnce(() => {
          if (writeSuccess) {
            return null;
          }
          throw sampleError;
        });

      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment
      module = require('.');
      expectedFilepath = path.join(__dirname, module.PATH_TO_STATUSFILE);
    });
  });

  it('attempts to write the server status to /dist/server/status.json', () => {
    expect(writeFileSpy).toHaveBeenCalledWith(
      expectedFilepath,
      JSON.stringify(sampleServerStatus, null, 2),
    );
  });

  describe('when it succeeds', () => {
    afterAll(() => {
      writeSuccess = false;
    });
    it('logs the success', () => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `<green text>${module.HEALTHFILE_EDIT_SUCCESS_MESSAGE}${expectedFilepath}</green text>`,
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('when theres an error', () => {
    it('logs the error', () => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `<red text>${module.HEALTHFILE_EDIT_ERROR_MESSAGE}${sampleError}</red text>`,
      );
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
