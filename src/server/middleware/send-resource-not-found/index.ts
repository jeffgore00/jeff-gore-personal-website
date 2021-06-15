import { Request, Response } from 'express';
import { enabledPageRoutes } from '../../../shared/constants';

import logger from '../../utils/runtime/logger';

// This is tested through API tests in the _root... API test file.
export function sendResourceNotFound(req: Request, res: Response): Response {
  const fileRegex = new RegExp(/^.*\.(html|js|ico|gz|map|jpg|gif|png|pdf)$/i);
  const pathsToSendIndexHtml = ['/', ...enabledPageRoutes];

  if (req.method === 'GET') {
    if (pathsToSendIndexHtml.includes(req.path)) {
      logger.error('Static file request error: index.html file not found!');
      return res.sendStatus(404);
    }
    if (fileRegex.exec(req.path)) {
      logger.error(
        `Static file request error: ${req.path.slice(1)} not found!`,
      );
      return res.sendStatus(404);
    }
  }
  return res
    .status(404)
    .send(
      `Operation "${req.method} ${req.path}" not recognized on this server.`,
    );
}
