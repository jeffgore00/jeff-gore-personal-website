import { createLogger, format, transports } from 'winston';
import { LogLevels, winstonErrorFormatter } from './logger-utils';

export const productionLogger = createLogger({
  levels: LogLevels,
  transports: [
    new transports.Console({
      level: 'info', // means that this and all levels below it will be logged
      format: format.combine(
        format.timestamp(),
        winstonErrorFormatter(),
        format.json(),
      ),
    }),
  ],
});
