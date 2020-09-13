import { RequestHandler } from 'express';
import { formatDistanceToNow } from 'date-fns';
import status from '../../status.json';

const serverStartTimestamp = new Date();

const healthCheckMiddleware: RequestHandler = (_, res) => {
  res.json({ ...status, uptime: formatDistanceToNow(serverStartTimestamp) });
};

export default healthCheckMiddleware;
