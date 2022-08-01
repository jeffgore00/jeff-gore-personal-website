import { Application, Request, Response, NextFunction } from 'express';

import { enabledPageRoutes } from '../../../../shared/constants';
import logger from '../logger';

export function sendHtmlForEnabledRoutes(
  app: Application,
  fileDirectory: string,
): void {
  enabledPageRoutes.forEach((pageRoute) => {
    app.get(pageRoute, (req: Request, res: Response, next: NextFunction) => {
      res.sendFile(`${fileDirectory}/index.html`, (err) => {
        if (err) {
          logger.error('Error sending index.html', { error: err });
          next();
        }
      });
    });
  });
}
