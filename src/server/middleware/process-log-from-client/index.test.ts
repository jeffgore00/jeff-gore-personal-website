/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';

import processLogFromClient from '.';
import { LogType, NewLogRequest } from '../../../shared/types/logging';
import logger from '../../utils/logger';

const infoLoggerSpy = jest.spyOn(logger, 'info').mockImplementation(jest.fn());
const warnLoggerSpy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn());
const errorLoggerSpy = jest
  .spyOn(logger, 'error')
  .mockImplementation(jest.fn());
const debugLoggerSpy = jest
  .spyOn(logger, 'debug')
  .mockImplementation(jest.fn());

describe('Middleware for logging from external source', () => {
  let response: Partial<Response>;
  const request: Partial<NewLogRequest> = {
    body: {
      message: 'TEST LOG',
      logType: LogType.Info,
      additionalData: {
        storeManager: 'John Smith',
        storeId: 39735,
      },
    },
    // @ts-ignore. Express has a special type for set-cookie arg that makes this difficult to mock.
    get(headerName: string) {
      if (headerName === 'Origin') {
        return 'http://localhost:8080';
      }
      return '';
    },
  };

  const expectedLogMessage = request.body.message;
  const expectedBakedInClientLogMetadata = {
    logFromClient: true,
    logSource: request.get('Origin'),
  };

  beforeAll(() => {
    response = {
      sendStatus: jest.fn(),
    } as Partial<Response>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('responds with 200', () => {
    processLogFromClient(request as Request, response as Response, null);
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });

  describe('When the request is for an INFO log', () => {
    beforeAll(() => {
      request.body.logType = LogType.Info;
    });
    it('calls the INFO logger with the attached information and prefixes the log message with the log source', () => {
      processLogFromClient(request as Request, response as Response, null);
      expect(infoLoggerSpy).toHaveBeenCalledWith(expectedLogMessage, {
        ...request.body.additionalData,
        ...expectedBakedInClientLogMetadata,
      });
    });
  });

  describe('When the request is for an ERROR log', () => {
    beforeAll(() => {
      request.body.logType = LogType.Error;
    });
    it('calls the ERROR logger with the attached information and prefixes the log message with the log source', () => {
      processLogFromClient(request as Request, response as Response, null);
      expect(errorLoggerSpy).toHaveBeenCalledWith(expectedLogMessage, {
        ...request.body.additionalData,
        ...expectedBakedInClientLogMetadata,
      });
    });
  });

  describe('When the request is for an WARN log', () => {
    beforeAll(() => {
      request.body.logType = LogType.Warn;
    });
    it('calls the WARN logger with the attached information and prefixes the log message with the log source', () => {
      processLogFromClient(request as Request, response as Response, null);
      expect(warnLoggerSpy).toHaveBeenCalledWith(expectedLogMessage, {
        ...request.body.additionalData,
        ...expectedBakedInClientLogMetadata,
      });
    });
  });

  describe('When the request is for a DEBUG log', () => {
    beforeAll(() => {
      request.body.logType = LogType.Debug;
    });
    it('calls the DEBUG logger with the attached information and prefixes the log message with the log source', () => {
      processLogFromClient(request as Request, response as Response, null);
      expect(debugLoggerSpy).toHaveBeenCalledWith(expectedLogMessage, {
        ...request.body.additionalData,
        ...expectedBakedInClientLogMetadata,
      });
    });
  });
});
