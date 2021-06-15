import express from 'express';

import { enabledPageRoutes } from '../../../../shared/constants';
import { sendHtmlForEnabledRoutes } from '.';
import * as sendResourceNotFoundModule from '../../../middleware/send-resource-not-found';

jest.mock('../../../../shared/constants', () => ({
  enabledPageRoutes: ['/about', '/blog', '/projects'],
}));

const app = express();
const req = {};
const res = {
  sendFile: jest.fn(),
};

const getSpy = jest.spyOn(app, 'get').mockImplementation(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (path: string, handler: (req: unknown, res: unknown) => void) => {
    handler(req, res);
  },
);

const sendResourceNotFoundSpy = jest
  .spyOn(sendResourceNotFoundModule, 'sendResourceNotFound')
  .mockImplementation(() => null);

describe('Send HTML for enabled routes', () => {
  beforeAll(() => {
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
      beforeAll(() => {
        jest.clearAllMocks();
        res.sendFile.mockImplementation(
          (dir: string, callback: (err?: Error) => void) => {
            callback(new Error('hi'));
          },
        );
        sendHtmlForEnabledRoutes(app, '/sample-directory');
      });
      it('calls sendResourceNotFound with the request and the response', () => {
        const { calls } = sendResourceNotFoundSpy.mock;

        expect(calls[0]).toEqual([req, res]);
        expect(calls[1]).toEqual([req, res]);
        expect(calls[2]).toEqual([req, res]);
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
      it('should not call sendResourceNotFound', () => {
        expect(sendResourceNotFoundSpy).not.toHaveBeenCalled();
      });
    });
  });
});
