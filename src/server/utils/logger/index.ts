import winston, { LogCallback } from 'winston';
import { Metadata } from '../../../shared/types/logging';

import { productionLogger } from './logger-prod';

type LoggerMethod = (
  message: string,
  metadata?: Metadata,
  callback?: LogCallback,
) => void;

interface ServerSideLogger {
  internalLogger: winston.Logger;
  info: LoggerMethod;
  debug: LoggerMethod;
  error: LoggerMethod;
  warn: LoggerMethod;
}

export class Logger implements ServerSideLogger {
  internalLogger: winston.Logger;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      /* This is dynamically required because "chalk" is a dev dependency. In production, even
      though the development logger is not used, a standard import would cause a crash due to that
      dependency being missing. */
      // eslint-disable-next-line max-len
      // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      this.internalLogger = require('./logger-dev').developmentLogger;
    } else {
      this.internalLogger = productionLogger;
    }
  }

  info(message: string, metadata?: Metadata, callback?: LogCallback): void {
    this.internalLogger.info(message, metadata, callback);
  }

  debug(message: string, metadata?: Metadata, callback?: LogCallback): void {
    this.internalLogger.debug(message, metadata, callback);
  }

  error(message: string, metadata?: Metadata, callback?: LogCallback): void {
    this.internalLogger.error(message, metadata, callback);
  }

  warn(message: string, metadata?: Metadata, callback?: LogCallback): void {
    this.internalLogger.warn(message, metadata, callback);
  }
}

export default new Logger();
