import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

import { LogLevels, winstonErrorFormatter } from './logger-utils';

const labels: { [index: string]: string } = {
  info: chalk.bgCyan.black(' INFO '),
  debug: chalk.bgMagenta.black(' DEBUG '),
  warn: chalk.bgYellow.black(' WARN '),
  error: chalk.bgRed.black(' ERROR '),
};

const devLoggerColorizer: {
  [index: string]: (logMessage: string) => string;
} = {
  info: (logMessage: string): string => chalk.cyan(logMessage),
  debug: (logMessage: string): string => chalk.magenta(logMessage),
  warn: (logMessage: string): string => chalk.yellow(logMessage),
  error: (logMessage: string): string => chalk.red(logMessage),
};

const developmentFormatter = format.printf((log) => {
  const { level, message, timestamp, ...additionalData } = log;
  const additionalDataKeyVals = Object.entries(additionalData).map(
    ([key, value]: [string, unknown]) => {
      let groomedValue = value;
      if (typeof value === 'object') {
        groomedValue = JSON.stringify(value);
      }
      return `data_${key}=${groomedValue}`;
    },
  );
  const additionalDataStr =
    additionalDataKeyVals.length > 0
      ? ` ${chalk.dim(additionalDataKeyVals.join(' '))}`
      : '';

  return `${labels[level]} ${devLoggerColorizer[level](
    `${message}${additionalDataStr}`,
  )} ${chalk.gray(timestamp)}`;
});

export const developmentLogger = createLogger({
  levels: LogLevels,
  transports: [
    new transports.Console({
      level: 'debug', // means that this and all levels below it will be logged
      format: format.combine(
        format.timestamp(),
        winstonErrorFormatter(),
        developmentFormatter,
      ),
    }),
  ],
});
