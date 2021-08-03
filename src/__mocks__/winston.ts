import { format as originalFormat } from 'winston';

export const format = originalFormat;

export const mockLogger = {
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// function returnedFormat() {
//   return jest.fn();
// }

// export const format = () => returnedFormat;

// format.timestamp = jest.fn();
// format.json = jest.fn();
// format.combine = jest.fn();
// format.printf = jest.fn();

export const createLogger = () => mockLogger;

export const transports = {
  Console: jest.fn(),
};
export type LogCallback = any;
export type Logger = any;

export default {
  format,
  createLogger,
  transports,
  LogCallback: null,
  Logger: null,
};
