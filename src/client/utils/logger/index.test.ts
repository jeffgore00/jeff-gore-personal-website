import axios from 'axios';
import { serializeError } from 'serialize-error';

import { Logger } from '.';
import { LogType } from '../../../shared/types/logging';

describe('Logger', () => {
  let logger: Logger;
  let axiosPutSpy: jest.SpyInstance;

  const SAMPLE_MESSAGE = 'sample message';
  const logTypes = Object.values(LogType);

  beforeAll(() => {
    appEnvironment = 'development';
    axiosPutSpy = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => Promise.resolve({ status: 200 }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // eslint-disable-next-line jest/expect-expect
  it('exposes the logging methods info, error, warn, debug', () => {
    // Just to demonstrate it is callable
    logger = new Logger();
    logTypes.forEach((logType) => {
      void logger[logType]('hi');
    });
  });

  describe('when called, each of those methods...', () => {
    it.each(logTypes.map((type) => [type]))(
      'issues a PUT request to the /api/logs endpoint with logType: %s',
      (logType) => {
        void logger[logType](SAMPLE_MESSAGE);
        expect(axiosPutSpy).toHaveBeenCalledWith(
          'http://localhost:1337/api/logs',
          {
            logType,
            logSource: 'UI',
            message: SAMPLE_MESSAGE,
          },
        );
      },
    );

    describe('When the optional `additionalData` argument is provided', () => {
      describe('When the `additionalData` value is a primitive', () => {
        it.each(logTypes.map((type) => [type]))(
          'issues a PUT request to the /api/logs endpoint plus `additionalData` key and primitive value',
          (logType) => {
            void logger[logType](SAMPLE_MESSAGE, { clientId: 12345 });
            expect(axiosPutSpy).toHaveBeenCalledWith(
              'http://localhost:1337/api/logs',
              {
                logType,
                logSource: 'UI',
                message: SAMPLE_MESSAGE,
                additionalData: { clientId: 12345 },
              },
            );
          },
        );
      });

      describe('When the `additionalData` value is an object', () => {
        it.each(logTypes.map((type) => [type]))(
          'issues a PUT request to the /api/logs endpoint plus `additionalData` key with stringified object value',
          (logType) => {
            void logger[logType](SAMPLE_MESSAGE, {
              formData: { firstName: 'Jeff' },
            });
            expect(axiosPutSpy).toHaveBeenCalledWith(
              'http://localhost:1337/api/logs',
              {
                logType,
                logSource: 'UI',
                message: SAMPLE_MESSAGE,
                additionalData: { formData: { firstName: 'Jeff' } },
              },
            );
          },
        );
      });

      describe('When the `additionalData` key is "error" and the value is an instance of an Error object', () => {
        const sampleError = new Error('Client-side error');

        it.each(logTypes.map((type) => [type]))(
          'issues a PUT request to the /api/logs endpoint plus `additionalData` key with serialized Error object',
          (logType) => {
            void logger[logType](SAMPLE_MESSAGE, { error: sampleError });
            expect(axiosPutSpy).toHaveBeenCalledWith(
              'http://localhost:1337/api/logs',
              {
                logType,
                logSource: 'UI',
                message: SAMPLE_MESSAGE,
                additionalData: {
                  error: serializeError(sampleError),
                },
              },
            );
          },
        );
      });
    });

    describe('When the call to the /api/logs endpoint is not successful', () => {
      let consoleSpy: jest.SpyInstance;
      beforeAll(() => {
        consoleSpy = jest
          .spyOn(console, 'error')
          .mockImplementation(() => null);
      });

      describe('When the call to the /api/logs endpoint responds with non 200-level response', () => {
        beforeAll(() => {
          axiosPutSpy = jest
            .spyOn(axios, 'put')
            .mockImplementation(() => Promise.resolve({ status: 401 }));
        });

        const SAMPLE_LOG_MESSAGE = 'SAMPLE_LOG_MESSAGE';

        it('Logs the error to the console', async () => {
          await logger.info(SAMPLE_LOG_MESSAGE);
          expect(consoleSpy).toHaveBeenCalledWith(
            `Failed to log message: "${SAMPLE_LOG_MESSAGE}". Error: Non-ok response from /api/logs endpoint: 401`,
          );
        });
      });

      describe('When the call to the /api/logs endpoint fails', () => {
        beforeAll(() => {
          axiosPutSpy = jest
            .spyOn(axios, 'put')
            .mockImplementation(() =>
              Promise.reject(new Error('ECONNREFUSED')),
            );
        });

        const SAMPLE_LOG_MESSAGE = 'SAMPLE_LOG_MESSAGE';

        it('Logs the error to the console', async () => {
          await logger.info(SAMPLE_LOG_MESSAGE);
          expect(consoleSpy).toHaveBeenCalledWith(
            `Failed to log message: "${SAMPLE_LOG_MESSAGE}". Error: ECONNREFUSED`,
          );
        });
      });
    });
  });
});
