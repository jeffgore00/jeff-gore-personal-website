import { Request, Response } from 'express';
import { enabledPageRoutes } from '../../../shared/constants';

import logger from '../../utils/runtime/logger';

// This is tested through API tests in the _root... API test file.
export function sendResourceNotFound(fileDirectory: string, err?: Error) {
  return (req: Request, res: Response): void => {
    const fileRegex = /^.*\.(html|js|ico|gz|map|jpg|gif|png|pdf)$/i;
    const pathsToSendIndexHtml = ['/', ...enabledPageRoutes];

    if (req.method === 'GET') {
      /* 
      Restating
      I. GET request
        1. It's a static file request.
          a. It's the HTML file itself being requested and the route requesting is valid
          b. It's a different static asset
        2. It's a content request
        3. It's a request of some route that doesn't exist, therefore will receive 404 HTML page

      II. Non-GET request
      */
      if (pathsToSendIndexHtml.includes(req.path)) {
        logger.error('Static file request error: index.html file not found!', {
          error: err,
        });
        res.sendStatus(500);
        return;
      }
      if (fileRegex.test(req.path)) {
        logger.error(
          `Static file request error: ${req.path.slice(1)} not found!`,
        );
        res.sendStatus(404);
        return;
      }
      if (req.params.contentId) {
        logger.error(`Content with ID "${req.params.contentId}" not found.`);
      }
      res.status(404).sendFile(`${fileDirectory}/index.html`, (error) => {
        if (error) {
          logger.error(
            'Attempted to send 404 HTML but index.html file not found!',
            { error },
          );
          res.sendStatus(500);
        }
      });
      return;
    }
    res
      .status(404)
      .send(
        `Operation "${req.method} ${req.path}" not recognized on this server.`,
      );
  };
}
