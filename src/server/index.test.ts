import http from 'http';

import app from './app';
import logger from './utils/logger';

jest.mock('./app');

const httpServerMock = {} as http.Server;
const serverListenMock = jest.fn(
  (path: string, listeningListener?: () => void) => listeningListener(),
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore. Ignoring TS here because it's ignoring the valid overload of this function.
httpServerMock.listen = serverListenMock;

describe('Server', () => {
  let loggerSpy: jest.SpyInstance;

  const httpSpy = jest
    .spyOn(http, 'createServer')
    .mockImplementation(jest.fn(() => httpServerMock));

  beforeEach(() => {
    loggerSpy = jest.spyOn(logger, 'info').mockImplementationOnce(jest.fn());
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      require('.');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates an HTTP server with the Express application', () => {
    expect(httpSpy).toHaveBeenCalledWith(app);
    expect(
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      loggerSpy.mock.calls[0][0].includes('HTTP server listening on port'),
    ).toBe(true);
  });

  describe('When process.env.PORT is defined', () => {
    beforeAll(() => {
      process.env.PORT = '8000';
    });

    afterAll(() => {
      delete process.env.PORT;
    });

    it('listens on that port', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(httpServerMock.listen).toHaveBeenCalledWith(
        process.env.PORT,
        expect.any(Function),
      );
    });
  });

  describe('When process.env.PORT is not defined', () => {
    beforeAll(() => {
      delete process.env.PORT;
    });

    it('listens on port 1337', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(httpServerMock.listen).toHaveBeenCalledWith(
        '1337',
        expect.any(Function),
      );
    });
  });
});
