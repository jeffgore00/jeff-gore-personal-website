/* eslint-disable global-require, @typescript-eslint/no-unsafe-assignment */
import { Request, RequestHandler, Response } from 'express';

describe('CORS Strict same origin', () => {
  let corsAllowWhitelistOnly: RequestHandler;
  let req: Partial<Request>;
  const res: Partial<Response> = {
    sendStatus: jest.fn(),
    getHeader: jest.fn(), // for cors middleware, will throw error without this
    setHeader: jest.fn(), // for cors middleware, will throw error without this
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When the origin is in the whitelist', () => {
    beforeEach(() => {
      req = {
        body: 'good intent',
        method: 'POST',
        originalUrl: 'https://www.app-that-uses-this-boilerplate.com/api/users',
        headers: { origin: 'http://goodintentions.com' },
      };

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
        const configExport = require('../../../shared/config');

        jest.spyOn(configExport, 'getConfig').mockImplementation(() => ({
          backendUrl: 'http://localhost:1337',
          frontendUrl: 'http://localhost:1337',
          corsWhitelist: ['http://goodintentions.com'],
        }));

        ({ corsAllowWhitelistOnly } = require('.'));
      });
    });

    it('calls `next`', () => {
      corsAllowWhitelistOnly(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the origin is not in the whitelist', () => {
    beforeEach(() => {
      req = {
        body: 'neutral intent',
        method: 'POST',
        originalUrl: 'https://www.app-that-uses-this-boilerplate.com/api/users',
        headers: {
          origin: 'http://neutralintentions.com',
          'user-agent': 'Chrome',
        },
      };
    });

    describe('When the whitelist contains "*"', () => {
      beforeEach(() => {
        jest.isolateModules(() => {
          // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
          const configExport = require('../../../shared/config');

          jest.spyOn(configExport, 'getConfig').mockImplementation(() => ({
            backendUrl: 'http://localhost:1337',
            frontendUrl: 'http://localhost:1337',
            corsWhitelist: ['http://goodintentions.com', '*'],
          }));

          ({ corsAllowWhitelistOnly } = require('.'));
        });
      });

      it('calls `next`', () => {
        corsAllowWhitelistOnly(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When the whitelist does not contain "*"', () => {
      let loggerSpy: jest.SpyInstance;

      beforeEach(() => {
        jest.isolateModules(() => {
          // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
          const configExport = require('../../../shared/config');

          jest.spyOn(configExport, 'getConfig').mockImplementation(() => ({
            backendUrl: 'http://localhost:1337',
            frontendUrl: 'http://localhost:1337',
            corsWhitelist: ['http://goodintentions.com'],
          }));

          // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
          const logger = require('../../utils/runtime/logger').default;
          loggerSpy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn());

          ({ corsAllowWhitelistOnly } = require('.'));
        });
      });

      it('sends a 403 response and logs the occurrence', () => {
        corsAllowWhitelistOnly(req as Request, res as Response, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(loggerSpy).toHaveBeenCalledWith(
          'Request "POST https://www.app-that-uses-this-boilerplate.com/api/users" from origin http://neutralintentions.com, user agent Chrome blocked by CORS policy',
          { requestBody: JSON.stringify(req.body) },
        );
      });
    });
  });
  describe('When process.env.PRODLIKE exists', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let configExport: any;

    beforeEach(() => {
      process.env.PRODLIKE = 'true';

      jest.isolateModules(() => {
        // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
        configExport = require('../../../shared/config');

        jest.spyOn(configExport, 'getConfig').mockImplementation(
          jest.fn(() => ({
            backendUrl: 'http://localhost:1337',
            frontendUrl: 'http://localhost:1337',
            corsWhitelist: ['http://goodintentions.com', '*'],
          })),
        );

        ({ corsAllowWhitelistOnly } = require('.'));
      });
    });

    it('calls `getConfig` with "prodlike"', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(configExport.getConfig).toHaveBeenCalledWith('prodlike');
    });
  });

  describe('When process.env.PRODLIKE does not exist', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let configExport: any;

    beforeEach(() => {
      delete process.env.PRODLIKE;

      jest.isolateModules(() => {
        // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
        configExport = require('../../../shared/config');

        jest.spyOn(configExport, 'getConfig').mockImplementation(
          jest.fn(() => ({
            backendUrl: 'http://localhost:1337',
            frontendUrl: 'http://localhost:1337',
            corsWhitelist: ['http://goodintentions.com', '*'],
          })),
        );

        ({ corsAllowWhitelistOnly } = require('.'));
      });
    });

    it('calls `getConfig` with undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(configExport.getConfig).toHaveBeenCalledWith(undefined);
    });
  });
});
