import { Request } from 'express';

export enum LogType {
  Info = 'info',
  Debug = 'debug',
  Warn = 'warn',
  Error = 'error',
}
export interface NewLogRequest extends Request {
  body: NewLogBody;
}
export interface NewLogBody {
  message: string;
  logType: LogType;
  additionalData?: Metadata;
}
export interface SerializedMetadata {
  [key: string]: string | number | boolean;
}

export interface Metadata {
  [key: string]: unknown;
}
