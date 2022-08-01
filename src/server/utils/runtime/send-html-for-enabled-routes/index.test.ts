import express from 'express';

import { enabledPageRoutes } from '../../../../shared/constants';
import { sendHtmlForEnabledRoutes } from '.';
import logger from '../logger';

jest.mock('../../../../shared/constants', () => ({
  enabledPageRoutes: ['/about', '/blog', '/projects'],
}));

const app = express();
const req = {};
const res = {
  sendFile: jest.fn(),
};
const next = jest.fn();

const getSpy = jest
  .spyOn(app, 'get')
  .mockImplementation(
    (
      path: string,
      handler: (req: unknown, res: unknown, next: unknown) => void,
    ) => {
      handler(req, res, next);
      return app;
    },
  );

describe('Send HTML for enabled routes', () => {
  beforeAll(() => {
    jest.spyOn(logger, 'error').mockImplementation(() => null);
    sendHtmlForEnabledRoutes(app, '/sample-directory');
  });

  it('Adds an Express middleware that sends index.html for any GET request to the provided routes', () => {
    // For some odd reason, the second call is for something that has nothing to do with this function.
    const calls = getSpy.mock.calls.filter((callArgs) => callArgs.length === 2);
    expect(calls.length).toEqual(3);

    expect(calls[0]).toEqual([enabledPageRoutes[0], expect.any(Function)]);
    expect(calls[1]).toEqual([enabledPageRoutes[1], expect.any(Function)]);
    expect(calls[2]).toEqual([enabledPageRoutes[2], expect.any(Function)]);
  });

  describe('The middleware', () => {
    it('calls res.sendFile', () => {
      const { calls } = res.sendFile.mock;

      expect(calls[0]).toEqual([
        '/sample-directory/index.html',
        expect.any(Function),
      ]);
      expect(calls[1]).toEqual([
        '/sample-directory/index.html',
        expect.any(Function),
      ]);
      expect(calls[2]).toEqual([
        '/sample-directory/index.html',
        expect.any(Function),
      ]);
    });

    describe('When res.sendFile has an error', () => {
      const sampleError = new Error('hi');
      beforeAll(() => {
        jest.clearAllMocks();
        res.sendFile.mockImplementation(
          (dir: string, callback: (err?: Error) => void) => {
            callback(sampleError);
          },
        );
        sendHtmlForEnabledRoutes(app, '/sample-directory');
      });
      it('logs the error', () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(logger.error).toHaveBeenCalledWith('Error sending index.html', {
          error: sampleError,
        });
      });

      it('calls next (to let the req proceed to error handling middleware)', () => {
        expect(next).toHaveBeenCalledWith();
      });
    });

    describe('When res.sendFile does not have an error', () => {
      beforeAll(() => {
        jest.clearAllMocks();
        res.sendFile.mockImplementation(
          (dir: string, callback: (err?: Error) => void) => {
            callback();
          },
        );
        sendHtmlForEnabledRoutes(app, '/sample-directory');
      });
      it('should not call next (since a response has already been sent)', () => {
        expect(next).not.toHaveBeenCalled();
      });
    });
  });
});
