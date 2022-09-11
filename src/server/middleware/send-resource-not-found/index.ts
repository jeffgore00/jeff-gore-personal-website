import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/runtime/logger';

// This is tested through API tests in the _root... API test file.
export function sendResourceNotFound(fileDirectory: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'GET') {
      res.status(404).sendFile(`${fileDirectory}/index.html`, (error) => {
        if (error) {
          logger.error(
            'Attempted to send 404 HTML for requested path but index.html file not found!',
            { error, path: req.path },
          );
          next(error);
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
