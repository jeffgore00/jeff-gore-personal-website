import axios, { AxiosResponse, AxiosError } from 'axios';
import { serializeError } from 'serialize-error';

import { LogType, Metadata } from '../../../shared/types/logging';
import { getConfig } from '../../../shared/config';

type SendLogToServer = (
  logType: LogType,
  message: string,
  additionalData?: Metadata,
) => Promise<void>;

type LoggerMethod = (message: string, metadata?: Metadata) => void;

export interface ClientSideLogger {
  sendLogToServer: SendLogToServer;
  info: LoggerMethod;
  debug: LoggerMethod;
  error: LoggerMethod;
  warn: LoggerMethod;
}

export class Logger implements ClientSideLogger {
  // eslint-disable-next-line class-methods-use-this
  sendLogToServer(
    logType: LogType,
    message: string,
    additionalData?: Metadata,
  ): Promise<void> {
    const serializedAdditionalData =
      additionalData &&
      Object.entries(additionalData).reduce(
        (
          returnObj: { [key: string]: unknown },
          [key, value]: [string, unknown],
        ) => {
          if (key === 'error' && value instanceof Error) {
            // eslint-disable-next-line no-param-reassign
            returnObj[key] = serializeError(value);
          } else {
            // eslint-disable-next-line no-param-reassign
            returnObj[key] = value;
          }
          return returnObj;
        },
        {},
      );

    return axios
      .put(`${getConfig(appEnvironment).backendUrl}/api/logs`, {
        logType,
        logSource: 'UI',
        message,
        ...(additionalData && {
          additionalData: serializedAdditionalData,
        }),
      })
      .then((res: AxiosResponse) => {
        if (res.status >= 300) {
          throw new Error(
            `Non-ok response from /api/logs endpoint: ${res.status}`,
          );
        }
      })
      .catch((err: AxiosError) => {
        // eslint-disable-next-line no-console
        console.error(
          `Failed to log message: "${message}". Error: ${err.message}`,
        );
      });
  }

  info(message: string, additionalData?: Metadata): Promise<void> {
    return this.sendLogToServer(LogType.Info, message, additionalData);
  }

  debug(message: string, additionalData?: Metadata): Promise<void> {
    return this.sendLogToServer(LogType.Debug, message, additionalData);
  }

  error(message: string, additionalData?: Metadata): Promise<void> {
    return this.sendLogToServer(LogType.Error, message, additionalData);
  }

  warn(message: string, additionalData?: Metadata): Promise<void> {
    return this.sendLogToServer(LogType.Warn, message, additionalData);
  }
}

export default new Logger();
