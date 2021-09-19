import { Application, Request, Response } from 'express';

import { enabledPageRoutes } from '../../../../shared/constants';
import { sendResourceNotFound } from '../../../middleware/send-resource-not-found';

export function sendHtmlForEnabledRoutes(
  app: Application,
  fileDirectory: string,
): void {
  enabledPageRoutes.forEach((pageRoute) => {
    app.get(pageRoute, (req: Request, res: Response) => {
      res.sendFile(`${fileDirectory}/index.html`, (err) => {
        if (err) {
          sendResourceNotFound(req, res);
        }
      });
    });
  });
}