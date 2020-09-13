import { RequestHandler } from 'express';
import logger from '../../utils/logger';
import { NewLogRequest } from '../../../shared/types/logging';

const processLogFromClient: RequestHandler = (req: NewLogRequest, res) => {
  const { body } = req;
  const { message, logType, additionalData } = body;

  logger[logType](message, {
    ...additionalData,
    logFromClient: true,
    logSource: req.get('Origin'),
  });

  res.sendStatus(200);
};

export default processLogFromClient;
