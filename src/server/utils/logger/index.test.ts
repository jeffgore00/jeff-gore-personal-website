import { serializeError } from 'serialize-error';

import { Logger } from '.';
import { LogType } from '../../../shared/types/logging';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleSpy = jest
      /* TS is saying _stdout doesn't exist on Console, but it does; it's what Winston uses.
      @ts-ignore. */
      // eslint-disable-next-line no-underscore-dangle, no-console
      .spyOn(console._stdout, 'write')
      .mockImplementation(() => null);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ISO datetime i.e '2020-11-21T22:37:51.226Z'
  // https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  const dateRegexString = `\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)`;

  it('exposes the logging methods info, error, warn, debug', () => {
    // Just to demonstrate it is 1) callable and 2) returns nothing, side effects only:
    logger = new Logger();
    Object.values(LogType).forEach((logType) => {
      const result = logger[logType]('hi');

      expect(result).toEqual(undefined);
    });
  });

  describe('When the environment is development', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
      logger = new Logger();
    });

    const devColorMap = {
      info: 'cyan',
      debug: 'magenta',
      warn: 'yellow',
      error: 'red',
    };

    const createTestRegex = (
      color: string,
      logType: string,
      logMessage: string,
      additionalData?: { [index: string]: unknown },
    ): RegExp => {
      const additionalDataStr = additionalData
        ? ` <dimmed text>${Object.entries(additionalData).map(
            ([key, value]) => `data_${key}=${value}`,
          )}</dimmed text>`
        : '';
      const regexStr = `<black text with ${color} background> ${logType.toUpperCase()} <\\/black text with ${color} background> <${color} text>${logMessage}${additionalDataStr}<\\/${color} text> <gray text>${dateRegexString}<\\/gray text>\\n`;
      return new RegExp(regexStr);
    };

    it('logs `info` logs in cyan with a grey timestamp', () => {
      const logMessage = 'THIS IS AN INFO LOG';
      logger.info(logMessage);
      const regex = createTestRegex('cyan', 'info', logMessage);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
    });

    it('logs `debug` logs in magenta with a grey timestamp', () => {
      const logMessage = 'THIS IS A DEBUG LOG';
      logger.debug(logMessage);
      const regex = createTestRegex('magenta', 'debug', logMessage);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
    });

    it('logs `warn` logs in yellow with a grey timestamp', () => {
      const logMessage = 'THIS IS A WARN LOG';
      logger.warn(logMessage);
      const regex = createTestRegex('yellow', 'warn', logMessage);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
    });

    it('logs `error` logs in red with a grey timestamp', () => {
      const logMessage = 'THIS IS AN ERROR LOG';
      logger.error(logMessage);
      const regex = createTestRegex('red', 'error', logMessage);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
    });

    describe('When the optional `additionalData` argument is provided', () => {
      it.each(Object.values(LogType).map((type) => [type]))(
        '%s method: logs them as data_key=value in the same color as the log level, but dim',
        (logType) => {
          const logMessage = 'THIS IS A LOG';
          const logAdditionalData = { clientId: 12345 };
          logger[logType](logMessage, logAdditionalData);
          const regex = createTestRegex(
            devColorMap[logType],
            logType,
            logMessage,
            logAdditionalData,
          );
          expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
        },
      );

      describe('When `additionalData` contains an `error` property that has a value that is an Error instance', () => {
        const sampleError = new Error('Server-side error');
        logger = new Logger();

        it('logs a serialized version of that error', () => {
          Object.values(LogType).forEach((logType) => {
            logger[logType]('hi', { error: sampleError });
            expect(consoleSpy).toHaveBeenCalledWith(
              expect.stringContaining(
                JSON.stringify(serializeError(sampleError)),
              ),
            );
            jest.clearAllMocks();
          });
        });
      });
    });
  });

  describe('When the environment is not development', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
      logger = new Logger();
    });

    describe('When the log level is not debug', () => {
      it('logs in plain JSON the log, log level, and timestamp', () => {
        Object.values(LogType)
          .filter((type) => type !== 'debug')
          .forEach((logType, index) => {
            logger[logType]('hi');

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(JSON.parse(consoleSpy.mock.calls[index][0])).toEqual({
              level: logType,
              message: 'hi',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              timestamp: expect.stringMatching(new RegExp(dateRegexString)),
            });
          });
      });
    });

    describe('When the log level is debug', () => {
      it('does not log anything to the console', () => {
        logger.debug('hi');
        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });
});
